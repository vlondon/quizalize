/* @flow */
var AppDispatcher           = require('./../dispatcher/CQDispatcher');
var router                  = require('./../config/router');

var TransactionApi          = require('./../actions/api/TransactionApi');
var TransactionConstants    = require('./../constants/TransactionConstants');
var QuizActions             = require('./../actions/QuizActions');
var stripeSDK               = require('./../config/stripeSDK');
var UserApi                 = require('./../actions/api/UserApi');
var TransactionStore        = require('./../stores/TransactionStore');

import UserStore    from './../stores/UserStore';
import priceFormat  from './../utils/priceFormat';

import type {Quiz}  from './../stores/QuizStore';
import type {AppType}   from './../stores/AppStore';
import type {Transaction}   from './../stores/TransactionStore';

var purchaseComplete = function(){
    swal({
        title: 'Purchase complete!',
        text: 'You will find the new content in your quizzes',
        type: 'success'
    }, ()=>{

        router.setRoute('/quiz/user');
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

    saveNewTransaction: function(transaction : Transaction, showComplete? : boolean) : Promise{

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
                console.log('localPrice', transaction.meta.price, localPrice);
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
                        router.setRoute('/quiz/user');
                    });
            });
    },


    buyQuiz: function(quiz : Quiz, free? : number) {
        var price = 0;
        var priceTag = "free";
        quiz.meta.price = quiz.meta.price || 0;
        if ((quiz.meta.price && quiz.meta.price !== 0) && !free) {
            price = quiz.meta.price;
            priceTag = priceFormat(quiz.meta.price, '$', 'us');
        }

        var newTransaction = {
            meta: {
                type: 'quiz',
                quizId: quiz.uuid,
                profileId: quiz.meta.profileId,
                price: price
            }
        };

        if (quiz.meta.price !== 0){

            swal({
                    title: 'Confirm Purchase',
                    text: `Buy this quiz for ${priceTag} and use it as many times as you need with your classes`,
                    showCancelButton: true,
                    confirmButtonText: 'Yes',
                    cancelButtonText: 'No',
                    html: true
                }, (isConfirm) => {

                if (isConfirm){
                    AnalyticsActions.sendEvent('quiz','buy-paid', quiz.meta.name);
                    AnalyticsActions.sendIntercomEvent('buy_paid_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
                    setTimeout(()=>{

                        swal({
                            title: 'Working…',
                            text: `We're processing your order`,
                            showConfirmButton: false
                        });

                        TransactionActions.saveNewTransaction(newTransaction, true);

                    }, 300);
                }
            });
        } else {
            AnalyticsActions.sendEvent('quiz', 'buy-free', quiz.meta.name);
            AnalyticsActions.sendIntercomEvent('buy_quiz', {uuid: quiz.uuid, name: quiz.meta.name});
            TransactionActions.saveNewTransaction(newTransaction, false).then(()=>{
                // TODO : Wrong uuid
                router.setRoute(`/quiz/multi/${quiz.uuid}`);
            });
        }

    },

    buyApp: function(app : AppType, free : ?boolean) {
        var price = 0;
        var priceTag = "free";
        if ((app.meta.price && app.meta.price !== 0) && !free) {
            price = app.meta.price;
            priceTag = priceFormat(app.meta.price, '$', 'us');
        }
        swal({
            title: 'Confirm Purchase',
            text: `Are you sure you want to purchase <br/><b>${app.meta.name}</b> <br/> for <b>${priceTag}</b>`,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            html: true
        }, (isConfirm) => {

            if (isConfirm){
                AnalyticsActions.sendEvent('app', 'buy', app.meta.name);
                AnalyticsActions.sendIntercomEvent('buy_app', {uuid: app.uuid, name: app.meta.name});
                setTimeout(()=>{

                    var newTransaction = {
                        meta: {
                            type: 'app',
                            appId: app.uuid,
                            profileId: app.meta.profileId,
                            price: price
                        }
                    };
                    console.log('new transaction', newTransaction);
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
