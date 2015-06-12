var request = require('superagent');
var Promise = require('es6-promise').Promise;

var GroupApi = {

    getGroups: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/users/${uuid}/groups`)
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

    getGroupContents: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/users/${uuid}/groups/contents`)
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

    unpublishQuiz: function(quizId, groupCode){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

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

    publishNewAssignment: function(quizId, groupName){
        return new Promise(function(resolve, reject){

            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/quizzes/${quizId}/publish`)
                    .send({
                        access: -1,
                        groupName
                    })
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

    publishAssignment: function(quizId, data){
        return new Promise(function(resolve, reject){

            var uuid = localStorage.getItem('cqUuid');

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
