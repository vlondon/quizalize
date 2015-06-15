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

    },
    uploadMedia: function(appId, file){
        return new Promise(function(resolve, reject){
            console.log('about to upload', file);
            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request
                    .post(`/create/${uuid}/apps/${appId}/icon`)
                    .attach('image', file, file.name)
                    .end(function(err, res){
                        if (err) {
                            reject();
                        } else {
                            resolve(res.body);
                        }
                    }, reject);
            }
        });
    }
};

module.exports = AppApi;
