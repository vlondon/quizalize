var _           = require('lodash');
var Promise     = require('es6-promise').Promise;
var zzish       = require('./../../zzish');
var assign      = require('object-assign');


exports.addUserToExtra = function(listOfContent){

    return new Promise(function(resolve, reject){


        listOfContent = _.isArray(listOfContent) ? listOfContent : [listOfContent];

        var listOfAuthors = _.uniq(listOfContent.map(function(item){
            return item.meta.profileId;
        }));

        zzish.getUsers(listOfAuthors, function(err, users){
            if (!err && typeof users === 'object') {
                var resolvedUsers = users.map(function(u){
                    var user = assign({}, u.attributes);
                    user.name = u.name;
                    user.uuid = u.uuid;
                    return user;
                });

                listOfContent.forEach(function(item){
                    var author = resolvedUsers.filter(function(a){ return a.uuid === item.meta.profileId; })[0];
                    item.extra = item.extra || {};
                    item.extra.author = author;
                });

                resolve(listOfContent);

            } else {
                reject(err);
            }
        });

    });
};
