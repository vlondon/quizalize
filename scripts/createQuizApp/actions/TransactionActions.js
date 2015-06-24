var AppDispatcher           = require('createQuizApp/dispatcher/CQDispatcher');
var router                  = require('createQuizApp/config/router');

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


    },


    buyQuiz: function(quiz,free) {
        var price = 0;
        var priceTag = "free";
        if ((quiz.meta.price && quiz.meta.price!=0) && !free) {
            price = quiz.meta.price;
            priceTag = "£" + quiz.meta.price.toFixed(2);
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

                    TransactionActions.saveNewTransaction(newTransaction)
                        .then(function(){
                            swal.close();
                            setTimeout(()=>{
                                swal({
                                    title: 'Purchase complete!',
                                    text: 'You will find the new content in your quizzes',
                                    type: 'success'
                                }, ()=>{
                                    router.setRoute('/quiz/quizzes');
                                });
                            }, 300);
                        });

                }, 300);
            }
        });
    }

};

module.exports = TransactionActions;
