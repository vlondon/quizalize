/* @flow */
import request from 'superagent';
var noCache;
if (typeof window !== 'undefined'){
    noCache = require('superagent-no-cache');
} else {
    noCache = function(){};
}

import type {AppType} from './../../stores/AppStore';
import { MeStore } from './../../stores';

var AppApi = {

    get: function() : Promise{
        return new Promise(function(resolve, reject){


            // reject();

            var uuid = MeStore.getUserId();

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

    getInfo: function(appId: string) : Promise{
        return new Promise(function(resolve, reject){

            // reject();

            // var uuid = localStorage.getItem('cqUuid');

            // if (!uuid) {
                // reject();
            // } else {
            request.get(`/apps/${appId}`)
                .use(noCache)
                .end(function(error, res){
                    if (error) {
                        reject();
                    } else {
                        resolve(res.body);
                    }
                });
            // }
        });
    },

    delete: function(app : AppType ) : Promise{
        return new Promise(function(resolve, reject){
            // reject();

            var uuid = MeStore.getUserId();

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

    putApp: function(app : AppType) : Promise {
        return new Promise(function(resolve, reject){


            // reject();

            var uuid = MeStore.getUserId();

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
    uploadMedia: function(appId : string, file : Object) : Promise{
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUserId();

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

    searchApps: (function(){

        var promises = [];

        return function(search : string = '', categoryId : string) : Promise {

            var chosenPromise = promises.filter(p => p.search === search && p.categoryId === categoryId)[0];

            if (chosenPromise){
                return chosenPromise.promise;
            } else {
                var promise = new Promise(function(resolve, reject){
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
                promises.push({ categoryId, search, promise });
                return promise;
            }

        };
    })(),

    publishApp: function(app : AppType) : Promise {
        return new Promise(function(resolve, reject){
            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.post(`/create/${uuid}/apps/${app.uuid}/publishToMarketplace`)
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
