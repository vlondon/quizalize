var AppDispatcher           = require('createQuizApp/dispatcher/CQDispatcher');
var router                  = require('createQuizApp/config/router');

var TransactionApi          = require('createQuizApp/actions/api/TransactionApi');
var TransactionConstants    = require('createQuizApp/constants/TransactionConstants');
var Promise                 = require('es6-promise').Promise;
var QuizActions             = require('createQuizApp/actions/QuizActions');
var UserStore               = require('createQuizApp/stores/UserStore');
var stripeSDK               = require('createQuizApp/config/stripeSDK');
var priceFormat             = require('createQuizApp/utils/priceFormat');


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

    saveNewTransaction: function(transaction){


        return new Promise(function(resolve, reject){

            var put = function(){
                TransactionApi.put(transaction)
                    .then(function(){
                        console.log('transaction saved saved');
                        QuizActions.loadQuizzes();
                        AppDispatcher.dispatch({
                            actionType: TransactionConstants.TRANSACTION_NEW,
                            payload: transaction
                        });
                        purchaseComplete();
                    })
                    .catch(reject);
            };

            console.log('saving new transaction', transaction);

            if (transaction.meta.price > 0) {
                swal.close();
                var userEmail = UserStore.getUser().email;
                console.log('creating stripe checkout', UserStore.getUser());
                stripeSDK.stripeCheckout(transaction.meta.price, userEmail)
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


    buyQuiz: function(quiz, free) {
        var price = 0;
        var priceTag = "free";
        if ((quiz.meta.price && quiz.meta.price !== 0) && !free) {
            price = quiz.meta.price;
            priceTag = priceFormat(quiz.meta.price);
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

                    TransactionActions.saveNewTransaction(newTransaction);


                }, 300);
            }
        });
    },

    publishQuiz: function(quiz, settings) {
        quiz.meta.price = settings.price;
        quiz.meta.publishing = "pending";
        QuizActions.newQuiz(quiz);
        swal({
            title: 'Thanks!',
            text: `Thanks for publishing your quiz! Our Quizalize team will get back to you within 24 hours!`,
            type: 'success'
        }, ()=>{
            router.setRoute(`/quiz/quizzes`);
        });
    }

};

module.exports = TransactionActions;
