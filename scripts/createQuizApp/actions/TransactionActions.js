/* @flow */
var Promise                 = require('es6-promise').Promise;

var AppDispatcher           = require('./../dispatcher/CQDispatcher');
var router                  = require('./../config/router');

var TransactionApi          = require('./../actions/api/TransactionApi');
var TransactionConstants    = require('./../constants/TransactionConstants');
var QuizActions             = require('./../actions/QuizActions');
var UserStore               = require('./../stores/UserStore');
var stripeSDK               = require('./../config/stripeSDK');
var UserApi                 = require('./../actions/api/UserApi');
var TransactionStore        = require('./../stores/TransactionStore');

import priceFormat from './../utils/priceFormat';

import type {Quiz} from './../stores/QuizStore';

type TransactionMeta = {
    type: string;
    quizId?: string;
    appId?: string;
    profileId: string;
    price: number
}
type Transaction = {
    meta: TransactionMeta;
    _token?: Object;
}
var purchaseComplete = function(){
    swal({
        title: 'Purchase complete!',
        text: 'You will find the new content in your quizzes',
        type: 'success'
    }, ()=>{

        router.setRoute('/quiz/quizzes');
    });
};

var TransactionActions = {

    loadApps: function(){
        TransactionApi.get()
            .then(function(apps){
                AppDispatcher.dispatch({
                    actionType: TransactionConstants.TRANSACTION_LOADED,
                    payload: apps
                });
            });
    },

    saveNewTransaction: function(transaction : Transaction, showComplete? : boolean){

        return new Promise(function(resolve, reject){
            showComplete = showComplete || false;
            var put = function(){
                TransactionApi.put(transaction)
                    .then(function(){
                        console.log('transaction saved saved');
                        AppDispatcher.dispatch({
                            actionType: TransactionConstants.TRANSACTION_NEW,
                            payload: transaction
                        });
                        if (showComplete){
                            purchaseComplete();
                        }
                        QuizActions.loadQuizzes();
                        resolve();
                    })
                    .catch(reject);
            };

            console.log('saving new transaction', transaction);

            if (transaction.meta.price > 0) {
                swal.close();
                var userEmail = UserStore.getUser().email;
                console.log('creating stripe checkout', UserStore.getUser());
                var localPrice = TransactionStore.getPriceInCurrency(transaction.meta.price, 'us');
                console.log('localPrice', localPrice);
                stripeSDK.stripeCheckout(localPrice, userEmail)
                    .then(function(stripeToken){
                        transaction._token = stripeToken;
                        console.log('we got transaction', transaction);
                        resolve(false);
                        put();
                    });
            } else {
                put();

            }

            // reject();


        });


    },

    getSharedQuiz: function(token : string){
        // magic to convert quizCode to quizId
        // var quiz = {};
        console.log('getSharedQuizgetSharedQuiz');
        TransactionApi.decrypt(token)
            .then((info)=>{
                console.log('getSharedQuizgetSharedQuiz', info);
                var newTransaction : Transaction = {
                    meta: {
                        type: 'quiz',
                        profileId: info.profileId,
                        quizId: info.uuid,
                        price: 0
                    }
                };
                TransactionActions.saveNewTransaction(newTransaction)
                    .then(()=>{

                        router.setRoute('/quiz/quizzes');
                    });
            });
    },


    buyQuiz: function(quiz : Quiz, free : number) {
        var price = 0;
        var priceTag = "free";
        if ((quiz.meta.price && quiz.meta.price !== 0) && !free) {
            price = quiz.meta.price;
            priceTag = priceFormat(quiz.meta.price, '$', 'us');
        }
        swal({
                title: 'Confirm Purchase',
                text: `Are you sure you want to purchase <br/><b>${quiz.meta.name}</b> <br/> for <b>${priceTag}</b>`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                html: true
            }, (isConfirm) => {

            if (isConfirm){
                UserApi.trackEvent('buy_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
                setTimeout(()=>{

                    var newTransaction = {
                        meta: {
                            type: 'quiz',
                            quizId: quiz.uuid,
                            profileId: quiz.meta.profileId,
                            price: price
                        }
                    };

                    swal({
                        title: 'Working…',
                        text: `We're processing your order`,
                        showConfirmButton: false
                    });

                    TransactionActions.saveNewTransaction(newTransaction, true);

                }, 300);
            }
        });
    }
};

module.exports = TransactionActions;
