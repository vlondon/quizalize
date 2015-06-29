var request = require('superagent');
var Promise = require('es6-promise').Promise;

var UserApi = {

    get: function(){
        return new Promise((resolve, reject) => {
            var uuid = localStorage.getItem('cqUuid');
            var token = localStorage.getItem('token');

            if (!uuid && !token){
                reject();
            // } else if (uuid && token) {
            //     localStorage.clean();
            //     reject();
            } else if(uuid) {
                request.get(`/user/${uuid}`)
                    .end(function(error, res){
                        if (error) {
                            reject();
                        } else {
                            resolve(res.body);
                        }

                    });
            } else if (token){
                this.getZzishUser(token).then(resolve).catch(reject);
            }

        });
    },

    getPublic: function(userId){
        return new Promise((resolve, reject) => {

            if (!userId){
                reject();

            } else {
                request.get(`/user/${userId}`)
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

    post: function(user){
        return new Promise((resolve, reject) => {
            var uuid = localStorage.getItem('cqUuid');
            if (!uuid){
                reject();
            } else {
                request.post(`/user/${uuid}`)
                    .send(user)
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

    getZzishUser: function(token) {

        return new Promise(function(resolve, reject){
            request.get(`/quiz/token/${token}`)
                .end(function(error, res){
                    console.log('res', res);
                    if (error || (res.body && res.body.uuid === undefined)) {
                        reject();
                    } else {
                        if (res.text === 'Invalid Request'){
                            localStorage.removeItem('token');
                            reject();
                        } else {
                            localStorage.setItem('cqUuid', res.body.uuid);
                            resolve(res.body);
                        }
                    }

                });
        });
    },

    login: function(data){
        return new Promise(function(resolve, reject){
            request.post('/user/authenticate')
                .send(data)
                .end(function(error, res){
                    if (error){
                        reject(error);
                    } else {
                        // TODO Move this to a more convenient place
                        localStorage.setItem('cqUuid', res.body.uuid);
                        resolve(res.body);
                    }
                });
        });
    },

    register: function(data){
        return new Promise(function(resolve, reject){
            request.post('/user/register')
                .send(data)
                .end(function(error, res){
                    console.log('res', res);
                    if (res.status === 409) {
                        reject(res.text);
                    } else if (error){
                        reject(error);
                    } else {
                        // TODO Move this to a more convenient place
                        localStorage.setItem('cqUuid', res.body.uuid);
                        resolve(res.body);
                    }
                });
        });
    },

    recover: function(email){
        return new Promise(function(resolve, reject){
            request.post('/user/forget')
                .send({email})
                .end(function(error, res){
                    if (error){
                        reject(error);
                    } else {
                        resolve(res.body);
                    }
                });
        });
    },

    reset: function(code, password){
        return new Promise(function(resolve, reject){
            request.post('/users/complete')
                .send({
                    code,
                    password
                })
                .end(function(error, res){
                    localStorage.setItem('cqUuid', res.body.uuid);
                    if (error){
                        reject(error);
                    } else {
                        resolve(res.body);
                    }
                });
        });
    }
};


module.exports = UserApi;
