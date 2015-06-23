//general zzish config
var uuid                = require('node-uuid');
var zzish               = require("zzishsdk");
var Promise             = require('es6-promise').Promise;

var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = 'quiz';
var APP_CONTENT_TYPE = 'app';


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

    var getApp = function(appId){
        return new Promise(function(resolve, reject){
            zzish.getPublicContent(APP_CONTENT_TYPE, appId, function(err, resp){
                if (err) { reject(err); } else { resolve(resp); }
            });
        });
    };

    var getQuiz = function(quizId, profileId){
        return new Promise(function(resolve, reject){
            console.log('trying to load', quizId);
            // zzish.getContent(profileId, 'quiz', transaction.meta.quizId, function(err2, quiz){

            zzish.getPublicContent(QUIZ_CONTENT_TYPE, quizId, function(err, resp){
                if (!err) {
                    // delete resp.payload;
                    resolve(resp);
                } else {
                    reject();
                }
            });
        });
    };

    return new Promise(function(resolve, reject){
        // is a quiz or an app?

        if (transaction.meta.type === 'app') {


            // object consisteny, to be removed
            transaction.meta.appId = transaction.meta.appId || transaction.meta.quizId;
            delete transaction.meta.quizId;
            console.log('about to save trasnaction', transaction);


            // loading the app
            getApp(transaction.meta.appId)
                .then(function(appInfo){

                    // loading the quizzes
                    var quizzesIds = appInfo.payload.quizzes;
                    var promises = quizzesIds.map(function(quizId){ return getQuiz(quizId); });
                    Promise.all(promises)
                        .then(function(quizzes){

                            // cloning the quizzes
                            var savePromises = [];
                            quizzes.forEach(function(quiz){
                                var clonedQuiz = cloneQuiz(quiz, profileId);

                                // saving the quizzes and resolving
                                savePromises.push(saveQuiz(clonedQuiz, profileId));
                                Promise.all(savePromises)
                                    .then(resolve);
                            });
                        });

                });


        } else if (transaction.meta.type === 'quiz') {
            getQuiz(transaction.meta.quizId)
                .then(function(quiz){
                    var clonedQuiz = cloneQuiz(quiz, profileId);
                    saveQuiz(clonedQuiz, profileId)
                        .then(resolve)
                        .catch(reject);

                });
        }
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
    var profileId = req.params.profileId;

    zzish.listContent(profileId, TRANSACTION_CONTENT_TYPE, function(err, resp){

        if (err) {
            res.send(err, 500);
        } else {
            var transactions = resp;

            transactions.forEach(function(transaction){
                if (transaction.meta.status === 'pending'){

                    processTransactions(transaction, profileId)
                        .then(function(){
                            transaction.meta.status = 'processed';
                            saveTransaction(transaction, profileId);
                            res.send('processed');
                        });
                } else {
                    res.send('nothing to process');
                }
            });

        }
    });

};
