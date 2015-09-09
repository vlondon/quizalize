var zzish = require("../zzish");
// var user = require('./../../user');

export var getUserByid = function(userId){
    return new Promise(function(resolve, reject){
        zzish.user(profileId, function(err, data){
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }

        });
    });

};
