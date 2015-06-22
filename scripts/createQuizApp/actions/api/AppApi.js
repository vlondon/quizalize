var request = require('superagent');
var noCache = require('superagent-no-cache');
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

    getInfo: function(appId){
        return new Promise(function(resolve, reject){

            // reject();

            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.get(`/apps/${appId}`)
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

    delete: function(app){
        return new Promise(function(resolve, reject){
            // reject();

            var uuid = localStorage.getItem('cqUuid');

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/apps/${app.uuid}/delete`)
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
    },

    searchApps: function(search = '', categoryId){
        return new Promise(function(resolve, reject){
            request.post(`/search/apps`)
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
};

module.exports = AppApi;
