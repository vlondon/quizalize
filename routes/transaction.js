//general zzish config
var uuid                = require('node-uuid');
var zzish               = require("zzishsdk");
var Promise             = require('es6-promise').Promise;

var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = 'quiz';


var saveTransaction = function(transaction, profileId){
    return new Promise(function(resolve, reject){
        zzish.postContent(
            profileId,
            TRANSACTION_CONTENT_TYPE,
            transaction.uuid,
            transaction.meta,
            transaction.payload,
            function(err, resp){
                if (!err) {
                    resolve(resp);
                } else {
                    reject();

                }

            });
    });
};

var cloneQuiz = function(quiz, profileId) {
    quiz.meta.originalQuizId = quiz.uuid;
    quiz.meta.authorId = quiz.meta.profileId;
    quiz.uuid = uuid.v4();
    quiz.meta.created = Date.now();
    quiz.meta.updated = Date.now();
    quiz.meta.profileId = profileId;

    delete quiz.meta.live;
    delete quiz.meta.featured;
    delete quiz.meta.featureDate;

    return quiz;
};

var saveQuiz = function(quiz, profileId) {
    return new Promise(function(resolve, reject){

        zzish.postContent(profileId, QUIZ_CONTENT_TYPE, quiz.uuid, quiz.meta, quiz.payload, function(err, resp){
            if (!err) {
                resolve(resp);
            } else{
                reject(err);
            }
        });
    });
};

var processTransactions = function(transaction, profileId){
    return new Promise(function(resolve, reject){
        zzish.getContent(transaction.meta.profileId, 'quiz', transaction.meta.quizId, function(err2, quiz){
            if (err2) {
                reject(err2);
            } else {
                console.log('quiz', quiz);
                var clonedQuiz = cloneQuiz(quiz, profileId);
                saveQuiz(clonedQuiz, profileId)
                    .then(resolve)
                    .catch(reject);
            }
            // we need to update the following fields
        });
    });
};



exports.list = function(req, res){
    var profileId = req.params.profileId;

    zzish.listContent(profileId, TRANSACTION_CONTENT_TYPE, function(err, resp){
        res.send(resp);
    });

};



exports.get = function(req, res){
    var id = req.params.id;
    var profileId = req.params.profileId;

    zzish.getContent(profileId, TRANSACTION_CONTENT_TYPE, id, function(err, resp){
        if(!err){
            console.log("request for content, got: ", resp);
            res.send(resp);
        }else{
            console.log("request for content, error: ", err);
            res.status = 400;
        }
    });
};

exports.delete = function(req, res){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteContent(profileId, TRANSACTION_CONTENT_TYPE, id, function(err, resp){
        res.send(err === undefined);
    });
};

exports.post = function(req, res){
    var profileId = req.params.profileId;
    var data = req.body;
    data.uuid = data.uuid || uuid.v4();


    // setting transaction to pending
    data.meta.status = 'pending';
    data.payload = data.payload || {};


    saveTransaction(data, profileId)
        .then(function(){
            processTransactions(data, profileId)
                .then(function(){
                    res.status = 200;
                    res.send();
                    data.meta.status = 'processed';
                    saveTransaction(data, profileId);
                })
                .catch(function(){
                    res.status = 400;
                    res.send();
                });
        })
        .catch(function(){
            res.status = 400;
            res.send();
        });
};



exports.process = function(req, res){
    console.log('processing');
    var profileId = req.params.profileId;

    zzish.listContent(profileId, TRANSACTION_CONTENT_TYPE, function(err, resp){

        if (err) {
            res.send(err, 500);
        } else {
            var transactions = resp;

            transactions.forEach(function(transaction){
                if (transaction.meta.status === 'pending'){

                    processTransactions(transaction, profileId)
                        .then(function(clonedQuiz){
                            return saveQuiz(clonedQuiz, profileId);
                        })
                        .then(function(quiz){
                            transaction.meta.status = 'processed';
                            saveTransaction(transaction, profileId);
                            // res.setond(quiz);
                        });
                } else {
                    res.send(transaction);
                }
            });

        }
    });

};
