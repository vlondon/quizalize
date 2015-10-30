/* @flow */
var request = require('superagent');
var noCache = require('superagent-no-cache');

import type {Quiz, QuizComplete} from './../../../../types';
import type {Topic} from './../../stores/TopicStore';
import MeStore from './../../stores/MeStore';

var QuizApi = {

    getQuizzes: function() : Promise {
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUuid();

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

        return function(search: string = '', categoryId: string) : Promise {
            let query = `{
                quizzes(search:"${search}") {
                    uuid,
                    meta {
                        name,
                        categoryId,
                        imageUrl,
                        price,
                        publicCategoryId,
                        updated
                    }
                }
            }`;
            // categoryId,
            // imageUrl,
            // price,
            // publicCategoryId,
            // updated
            var promise = new Promise(function(resolve, reject){
                request.post(`/graphql/`)
                    .set('Content-Type', 'application/graphql')
                    .send(query)
                    .end(function(error, res){
                        console.log('res', res.body);
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body.data.quizzes);
                        }

                    });

                });

            promises.push({ categoryId, search, promise });
            return promise;
            // var chosenPromise = promises.filter(p => p.search === search && p.categoryId === categoryId)[0];
            // if (chosenPromise){
            //     return chosenPromise.promise;
            // } else {
            //
            //
            // }
        };
    })(),


    getQuiz: (function(){
        var promises = {};
        return function(quizId : string) : Promise{
            promises[quizId] = promises[quizId] || new Promise(function(resolve, reject){
                var uuid = MeStore.getUuid();


                if (!uuid) {
                    reject();
                } else {
                    request.get(`/create/${uuid}/quizzes/${quizId}`)
                        .use(noCache)
                        .end(function(error, res){
                            if (error) {
                                console.error('we got error', error);
                                reject(error);
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
            var uuid = MeStore.getUuid();

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
                            console.error('there has been an error', error);
                            reject('getTopics failed');
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
                var uuid = MeStore.getUuid();

                if (!uuid) {
                    reject('getUserTopics: no uuid has been defined');
                } else {
                    request.get(`/create/${uuid}/topics/`)
                        .use(noCache)
                        .end(function(error, res){
                            if (error) {
                                console.error('there has been an error', error);
                                reject('getUserTopics failed', error);
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
            var uuid = MeStore.getUuid();

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

    putQuiz: function(quiz : QuizComplete) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUuid();
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
    shareQuiz: function(quizId : string, data: {email: string; quiz: Quiz; emails?: Array<string>; link?: string }) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUuid();

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
            var uuid = MeStore.getUuid();

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
