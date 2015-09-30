/* @flow */
var request = require('superagent');
var noCache = require('superagent-no-cache');

import MeStore from './../../stores/MeStore';

var GroupApi = {

    getGroups: function() : Promise {
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.get(`/users/${uuid}/groups`)
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

    getGroupContents: function() : Promise {
        return new Promise(function(resolve, reject){

            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.get(`/users/${uuid}/groups/contents`)
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

    unpublishQuiz: function(quizId : string, groupCode : string) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quizId}/${groupCode}/unpublish`)
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

    publishNewAssignment: function(quizId : string, data : Object ) : Promise {
        return new Promise(function(resolve, reject){

            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quizId}/publish`)
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

    publishAssignment: function(quizId : string, data : Object) : Promise {
        return new Promise(function(resolve, reject){

            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quizId}/publish`)
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
    }
};

module.exports = GroupApi;
