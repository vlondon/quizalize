var request = require('superagent');
var Promise = require('es6-promise').Promise;

var QuizApi = {

    getQuizzes: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

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

    getPublicQuizzes: function(){
        return new Promise(function(resolve, reject){
            request.get(`/quizzes/public`)
                .end(function(error, res){
                    if (error) {
                        reject();
                    } else {
                        console.log('res', res.body);
                        res.body.categories = res.body.categories.filter(c => c !== null);
                        res.body.contents = res.body.contents.filter(c => c !== null);
                        resolve(res.body);
                    }

                });

        });
    },

    searchQuizzes: function(search = '', categoryId){
        return new Promise(function(resolve, reject){
            request.post(`/search/quizzes`)
                .send({search, categoryId})
                .end(function(error, res){
                    if (error) {
                        reject();
                    } else {
                        resolve(res.body);
                    }

                });

        });
    },


    getQuiz: function(quizId){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

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


    getTopics: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('cqUuid');

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
    }
};


module.exports = QuizApi;
