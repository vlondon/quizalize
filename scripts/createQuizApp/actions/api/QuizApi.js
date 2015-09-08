/* @flow */
var request = require('superagent');
var noCache = require('superagent-no-cache');

import type {Quiz} from './../../stores/QuizStore';
import type {Topic} from './../../stores/TopicStore';
import UserStore from './../../stores/UserStore';

var QuizApi = {

    getQuizzes: function() : Promise {
        return new Promise(function(resolve, reject){
            var uuid = UserStore.getUserId();

            if (!uuid) {
                reject();
            } else {

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

    searchQuizzes: (function(){

        var promises = [];

        return function(search: string = '', categoryId: string, profileId: string) : Promise {

            var chosenPromise = promises.filter(p => p.search === search && p.categoryId === categoryId)[0];
            if (chosenPromise){
                return chosenPromise.promise;
            } else {
                var TopicStore = require('./../../stores/TopicStore');
                var subjects = TopicStore.getPublicSubjects();
                var promise = new Promise(function(resolve, reject){
                    request.post(`/search/quizzes`)
                        .send({search, categoryId, profileId, subjects})
                        .end(function(error, res){
                            if (error) {
                                reject();
                            } else {
                                resolve(res.body);
                            }

                        });

                    });

                promises.push({ categoryId, search, promise });
                return promise;
            }
        };
    })(),


    getQuiz: (function(){
        var promises = {};
        return function(quizId : string) : Promise{
            promises[quizId] = promises[quizId] || new Promise(function(resolve, reject){
                var uuid = UserStore.getUserId();


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
        return function(quizId : string) : Promise {
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

    deleteQuiz: function(quizId : string) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = UserStore.getUserId();

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
        return function() : Promise {

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
        return function() : Promise {

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

    putTopic: function(topic : Topic) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = UserStore.getUserId();

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

    putQuiz: function(quiz : Quiz) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = UserStore.getUserId();
            if (!uuid) {
                reject();
            } else {
                quiz.meta.profileId = uuid;
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
    shareQuiz: function(quizId : string, data: Quiz) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = UserStore.getUserId();

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
    publishQuiz: function(quiz: Quiz) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = UserStore.getUserId();

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
