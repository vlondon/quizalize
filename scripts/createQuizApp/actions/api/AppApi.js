var request = require('superagent');
var Promise = require('es6-promise').Promise;

var AppApi = {

    get: function(app){
        return new Promise(function(resolve, reject){


            // reject();

            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/create/${uuid}/apps/`)
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

    putApp: function(app){
        return new Promise(function(resolve, reject){


            // reject();

            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/apps/${app.uuid}`)
                    .send(app)
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

module.exports = AppApi;
