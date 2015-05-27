var request = require('superagent');
var Promise = require('es6-promise').Promise;

var QuizApi = {

    getQuizzes: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('uuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/create/${uuid}/quizzes/`)
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

    getQuiz: function(quizId){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('uuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/create/${uuid}/quizzes/${quizId}`)
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

    getTopics: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('uuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/create/${uuid}/topics/`)
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

    putTopic: function(topic){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('uuid');

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
            var uuid = localStorage.getItem('uuid');

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

    }
};


module.exports = QuizApi;
