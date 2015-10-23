/* @flow */
var request = require('superagent');
var noCache;
if (typeof window !== 'undefined'){
    noCache = require('superagent-no-cache');
} else {
    noCache = function(){};
}

import type {Transaction} from './../../stores/TransactionStore';
import MeStore from './../../stores/MeStore';

var AppApi = {

    get: function() : Promise {
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


    put: function(transaction : Transaction) : Promise {
        return new Promise(function(resolve, reject){

            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                var postUrl = (transaction.uuid) ? `/create/${uuid}/transaction/${transaction.uuid}` : `/create/${uuid}/transaction`;
                request.post(postUrl)
                    .send(transaction)
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

    decrypt: function(token : string ) : Promise {
        return new Promise((resolve, reject)=>{
            var uuid = MeStore.getUserId();

            if (!uuid) {
                reject();
            } else {
                request.get(`/create/${uuid}/decrypt/${token}`)
                    .end((error, res)=>{
                        if (error){
                            reject(error);
                        } else {
                            resolve(res.body);
                        }
                    });
            }
        });
    }
};

module.exports = AppApi;
