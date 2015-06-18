var _           = require('lodash');
var Promise     = require('es6-promise').Promise;
var zzish       = require('./../../zzish');


exports.getUsersFromIds = function(arrayOfUserIds){

    var queryUserId = function(userId){
        return new Promise(function(resolve, reject){

            zzish.user(userId, function(err, user){
                if (!err && typeof user === 'object') {
                    var userResponse = {};
                    userResponse = user.attributes;
                    userResponse.name = user.name;
                    userResponse.uuid = userId;
                    resolve(userResponse);
                } else {
                    reject();
                }
            });
        });
    };

    return new Promise(function(resolve, reject){

        var promises = [];

        arrayOfUserIds = _.uniq(arrayOfUserIds);

        arrayOfUserIds.forEach(function(userId) {
            promises.push(queryUserId(userId));
        });

        Promise.all(promises)
            .then(resolve)
            .catch(reject);

    });
};
