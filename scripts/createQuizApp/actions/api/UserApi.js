var request = require('superagent');
var Promise = require('es6-promise').Promise;

var UserApi = {

    get: function(){
        return new Promise((resolve, reject) => {
            var uuid = localStorage.getItem('uuid');
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

    getZzishUser: function(token) {

        return new Promise(function(resolve, reject){
            request.get(`/quiz/token/${token}`)
                .end(function(error, res){
                    console.log('res', res);
                    if (error || res.body.uuid === undefined) {
                        reject();
                    } else {
                        if (res.body === 'Invalid Request'){
                            reject();
                        } else {
                            localStorage.setItem('uuid', res.body.uuid);
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
                        localStorage.setItem('uuid', res.body.uuid);
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
                    if (error){
                        reject(error);
                    } else {
                        // TODO Move this to a more convenient place
                        localStorage.setItem('uuid', res.body.uuid);
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
    }
};


module.exports = UserApi;
