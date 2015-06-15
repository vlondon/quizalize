var AppDispatcher           = require('createQuizApp/dispatcher/CQDispatcher');

var TransactionApi          = require('createQuizApp/actions/api/TransactionApi');
var TransactionConstants    = require('createQuizApp/constants/TransactionConstants');
var Promise                 = require('es6-promise').Promise;
var QuizActions             = require('createQuizApp/actions/QuizActions');


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

    saveNewTransaction: function(transaction){


        return new Promise(function(resolve, reject){

            TransactionApi.put(transaction)
                .then(function(){
                    console.log('transaction saved saved');
                    QuizActions.loadQuizzes();
                    AppDispatcher.dispatch({
                        actionType: TransactionConstants.TRANSACTION_NEW,
                        payload: transaction
                    });
                    resolve();
                })
                .catch(reject);
        });


    }

};

module.exports = TransactionActions;
