/* @flow */
//general zzish config
var uuid                = require("node-uuid");
var zzish               = require("zzishsdk");
var stripeHelper        = require("./helpers/stripeHelper");
var logger              = require("../logger");


var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = "quiz";
var APP_CONTENT_TYPE = "app";


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
    delete quiz.meta.published;
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

var chargeForTransaction = function(transaction){
    return new Promise(function(resolve, reject){
        if (transaction._token) {
            transaction.payload = transaction.payload || {};
            transaction.payload.token = transaction._token;
            var stripeToken = transaction._token.id;
            stripeHelper.processPayment(transaction, stripeToken)
                .then(function(charge){
                    console.log("stripe response", charge);
                    transaction.payload.charge = charge;
                    if (charge.paid){
                        resolve();
                    } else {
                        reject("Stripe error");
                    }

                }).catch(reject);
        } else {
            reject();
        }
    });
};

var setStripePlan = function(transaction, user) : Promise {
    return new Promise(function(resolve, reject){
        if (transaction._token){
            let stripeToken = transaction._token.id;
            stripeHelper.processSubscription(transaction, stripeToken, user)
                .then((charge)=>{
                    transaction.payload.charge = charge;
                    resolve(transaction);
                })
                .catch(reject);
        }
    });
};

var processTransactions = function(transaction, profileId, user){
    let userEmail = user.email;
    var getApp = function(appId){
        return new Promise(function(resolve, reject){
            zzish.getPublicContent(APP_CONTENT_TYPE, appId, function(err, resp){
                if (err) { reject(err); } else { resolve(resp); }
            });
        });
    };

    var getQuiz = function(quizId){
        return new Promise(function(resolve, reject){
            logger.trace("trying to load", quizId);
            // zzish.getContent(profileId, "quiz", transaction.meta.quizId, function(err2, quiz){

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
        // process payment
        // is a quiz or an app?
        if (transaction.meta.type === "app") {
            // object consisteny, to be removed
            transaction.meta.appId = transaction.meta.appId || transaction.meta.quizId;
            delete transaction.meta.quizId;
            logger.info("about to save trasnaction", transaction);


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


        } else if (transaction.meta.type === "quiz") {
            getQuiz(transaction.meta.quizId)
                .then(function(quiz){
                    var clonedQuiz = cloneQuiz(quiz, profileId);
                    saveQuiz(clonedQuiz, profileId)
                        .then(resolve)
                        .catch(reject);

                });
        } else if (transaction.meta.type === "subscription") {
            logger.info("we got subscription to process", userEmail, transaction);
            transaction.meta.status = "rejected";
            saveTransaction(transaction, profileId);
            reject();

        }

    });
};



exports.list = function(req : Object, res : Object){
    var profileId = req.params.profileId;

    zzish.listContent(profileId, TRANSACTION_CONTENT_TYPE, function(err, resp){
        if (err) {
            res.status(500).send(err);
        }
        res.send(resp);
    });

};



exports.get = function(req : Object, res : Object){
    var id = req.params.id;
    var profileId = req.params.profileId;

    zzish.getContent(profileId, TRANSACTION_CONTENT_TYPE, id, function(err, resp){
        if(!err){
            logger.trace("request for content,", id," got: ", resp);
            res.send(resp);
        }else{
            logger.error("request for content,", id," error: ", err);
            res.status = 400;
        }
    });
};

exports.delete = function(req : Object, res : Object){
    var profileId = req.params.profileId;
    var id = req.params.id;

    zzish.deleteContent(profileId, TRANSACTION_CONTENT_TYPE, id, function(err){
        res.send(err === undefined);
    });
};

exports.post = function(req : Object, res : Object){

    var profileId = req.params.profileId;
    var data = req.body;
    var user = req.session.user;
    logger.trace("session info", req.session);
    data.uuid = data.uuid || uuid.v4();

    // setting transaction to pending
    data.meta.status = "pending";
    data.payload = data.payload || {};

    var saveProcessedTransaction = function(result){
        logger.info("saving processed transaction", data, profileId);
        res.status = 200;
        res.send(result);
        data.meta.status = "processed";
        saveTransaction(data, profileId);
    };

    var errorHandler = function(error){
        res.status(500).send(error);
    };

    logger.info("about to save transaction", data);

    saveTransaction(data, profileId)
        .then(function(){
            if (data.meta.subscription){
                logger.info("charging for subscription", data, user);
                setStripePlan(data, user)
                    .then(saveProcessedTransaction);
            } else if (data.meta.price && data.meta.price > 0) {
                logger.info("charginng for transaction for app or quiz");
                chargeForTransaction(data)
                    .then(function(){
                        logger.info("processing transaction");
                        processTransactions(data, profileId, user)
                            .then(saveProcessedTransaction)
                            .catch(function(){
                                res.status = 400;
                                res.send();
                            });
                    }).catch(errorHandler);
            } else {
                processTransactions(data, profileId, user)
                    .then(saveProcessedTransaction)
                    .catch(function(){
                        res.status = 400;
                        res.send();
                    });
            }
        })
        .catch(function(){
            res.status = 400;
            res.send();
        });
};



exports.process = function(req : Object, res : Object){
    var profileId = req.params.profileId;
    let userEmail = req.session.user.email;

    zzish.listContent(profileId, TRANSACTION_CONTENT_TYPE, function(err, resp){

        if (err) {
            res.send(err, 500);
        } else {
            var transactions = resp;
            transactions.forEach(function(transaction){
                if (transaction.meta.status === "pending"){

                    processTransactions(transaction, profileId, userEmail)
                        .then(function(){
                            transaction.meta.status = "processed";
                            saveTransaction(transaction, profileId);
                            res.send("processed");
                        });
                } else {
                    res.send("nothing to process");
                }
            });

        }
    });

};
