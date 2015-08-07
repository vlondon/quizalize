var request = require('superagent');
var noCache = require('superagent-no-cache');
var Promise = require('es6-promise').Promise;

var QuizApi = {

    getQuizzes: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                console.log('we are loading');
                request.get(`/create/${uuid}/quizzes/`)
                    .use(noCache)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }

                    });
            }

        });
    },

    searchQuizzes: function(search = '', categoryId, profileId){
        console.log('searchQuizzes');
        return new Promise(function(resolve, reject){
            request.post(`/search/quizzes`)
                .send({search, categoryId, profileId})
                .end(function(error, res){
                    if (error) {
                        reject();
                    } else {
                        resolve(res.body);
                    }

                });

        });
    },


    getQuiz: (function(){
        var promises = {};
        return function(quizId){
            promises[quizId] = promises[quizId] || new Promise(function(resolve, reject){
                var uuid = localStorage.getItem('cqUuid');


                if (!uuid) {
                    reject();
                } else {
                    request.get(`/create/${uuid}/quizzes/${quizId}`)
                        .use(noCache)
                        .end(function(error, res){
                            if (error) {
                                reject();
                            } else {
                                resolve(res.body);
                            }
                        });
                }
            });
            return promises[quizId];
        };
    })(),

    getPublicQuiz: (function(){
        var promises = {};
        return function(quizId){
            promises[quizId] = promises[quizId] || new Promise(function(resolve, reject){

                request.get(`/quizzes/public/${quizId}`)
                    .use(noCache)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }
                    });


            });
            return promises[quizId];
        };
    })(),

    deleteQuiz: function(quizId){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quizId}/delete`)
                    .send({})
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }

                    });
            }
        });
    },


    getTopics: (function(){
        var promise;
        return function(){

            promise = promise || new Promise(function(resolve, reject){


                request.get(`/create/topics/`)
                    .use(noCache)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }

                    });

            });
            return promise;

        };
    })(),

    getUserTopics: (function(){
        var promise;
        return function(){

            promise = promise || new Promise(function(resolve, reject){
                var uuid = localStorage.getItem('cqUuid');

                if (!uuid) {
                    reject();
                } else {
                    request.get(`/create/${uuid}/topics/`)
                        .use(noCache)
                        .end(function(error, res){
                            if (error) {
                                reject();
                            } else {
                                resolve(res.body);
                            }

                        });
                }
            });
            return promise;

        };
    })(),

    putTopic: function(topic){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/topics/`)
                    .send(topic)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }
                    });
            }
        });
    },

    putQuiz: function(quiz){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');
            console.log("PUTTING QUIZ");
            quiz.meta.profileId = uuid;
            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quiz.uuid}`)
                    .send(quiz)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }
                    });
            }
        });

    },
    shareQuiz: function(quizId, data){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quizId}/share`)
                    .send(data)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }
                    });
            }
        });
    },
    publishQuiz: function(quiz) {
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quiz.uuid}/publishToMarketplace`)
                    .send(quiz)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }
                    });
            }
        });
    }
};


module.exports = QuizApi;
