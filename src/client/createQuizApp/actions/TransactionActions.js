/* @flow */
import AppDispatcher  from './../dispatcher/CQDispatcher';
import {
    router,
    stripeSDK
} from './../config';


import { TransactionApi } from './../actions/api';
import { TransactionConstants } from './../constants';
import {
    QuizActions,
    UserActions,
    AnalyticsActions
} from './../actions';

import {
    TransactionStore,
    MeStore
} from './../stores';

import {priceFormat} from './../utils';

import type {
    Quiz,
    AppType
} from './../../../types';

import type {Transaction} from './../stores/TransactionStore';

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
                        AppDispatcher.dispatch({
                            actionType: TransactionConstants.TRANSACTION_NEW,
                            payload: transaction
                        });
                        if (showComplete){
                            purchaseComplete();
                        }
                        QuizActions.loadQuizzes();
                        UserActions.getOwn();
                        resolve();
                    })
                    .catch(reject);
            };

            if (transaction.meta.price > 0 || transaction.meta.subscription) {
                swal.close();
                var userEmail = MeStore.state.email;
                var localPrice = TransactionStore.getPriceInCurrency(transaction.meta.price, 'us');
                stripeSDK.stripeCheckout(localPrice, userEmail)
                    .then(function(stripeToken){
                        transaction._token = stripeToken;
                        resolve(false);
                        put();
                    });
            } else {
                put();

            }
        });


    },

    getSharedQuiz: function(token : string){
        // magic to convert quizCode to quizId
        // var quiz = {};
        TransactionApi.decrypt(token)
            .then((info)=>{
                var newTransaction : Transaction = {
                    meta: {
                        type: 'quiz',
                        profileId: info.profileId,
                        quizId: info.uuid,
                        created: Date.now(),
                        price: 0
                    }
                };
                TransactionActions.saveNewTransaction(newTransaction)
                    .then(()=>{
                        UserActions.getOwn();
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
                created: Date.now(),
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
                            created: Date.now(),
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
    },

    buyMonthlySubscription: function() : Promise{
        let user = MeStore.state;

        let newTransaction : Transaction = {
            meta: {
                type: 'subscription',
                profileId: user.profileId,
                created: Date.now(),
                price: 0,
                subscription: 'monthly'
            }
        };
        return this.saveNewTransaction(newTransaction);
        // stripeSDK.stripeCheckout(localPrice, userEmail)
    },

    buyHalfYearSubscription: function() : Promise {
        console.log('about to get subscription');
        let user = MeStore.state;

        let newTransaction : Transaction = {
            meta: {
                type: 'subscription',
                profileId: user.profileId,
                created: Date.now(),
                price: 0,
                subscription: 'halfyear'
            }
        };
        return this.saveNewTransaction(newTransaction);
        // stripeSDK.stripeCheckout(localPrice, userEmail)
    },

    buyYearSubscription: function() : Promise {
        let user = MeStore.state;

        let newTransaction : Transaction = {
            meta: {
                type: 'subscription',
                profileId: user.profileId,
                created: Date.now(),
                price: 0,
                subscription: 'year'
            }
        };
        return this.saveNewTransaction(newTransaction);
    }
};

module.exports = TransactionActions;
