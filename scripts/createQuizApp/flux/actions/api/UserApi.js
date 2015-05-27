var request = require('superagent');
var Promise = require('es6-promise').Promise;

var UserApi = {

    get: function(){
        return new Promise(function(resolve, reject){
            var uuid = localStorage.getItem('uuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/user/${uuid}`)
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

    login: function(data){
        return new Promise(function(resolve, reject){
            request.post('/user/authenticate')
                .send(data)
                .end(function(error, res){
                    if (error){
                        reject(false);
                    } else {
                        // TODO Move this to a more convenient place
                        localStorage.setItem('uuid', res.body.uuid);
                        resolve(res.body);
                    }
                });
        });
    }
};


module.exports = UserApi;
