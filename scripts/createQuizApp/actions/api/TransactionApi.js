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

    put: function(transaction){
        return new Promise(function(resolve, reject){

            var uuid = localStorage.getItem('cqUuid');

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

    }
};

module.exports = AppApi;
