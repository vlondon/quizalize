var zzish = require("../../zzish");
import logger from './../../logger';
import user from './../../routes/user';
import {getSubscription} from './../helpers/stripeHelper';

class User {

    constructor(user){
        // Object.assign(this, user);

        this.user = user;
        this.uuid = user.uuid;
        this._userQuizzesInit = false;

    }

    toJSON(){
        return this.user;
    }



    getUserQuizzes(){
        if (!this._userQuizzesInit) {
            this.userQuizzes = [];

            var performQuery = function(mongoQuery) {

                return new Promise((resolve, reject)=>{
                    zzish.searchPublicContent('quiz', mongoQuery, function(err, resp){
                        if (resp) {
                            resolve(resp);
                        } else {
                            reject(error);
                        }
                    });
                });
            };

            let now = Date.now();
            let lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;

            let mongoQuery = {
                updated: {
                    $gt: lastYear
                },
                published: "published",
                name: {
                    $regex: '', $options: 'i'
                },
                profileId

            };

            return performQuery(mongoQuery);

        }
    }

}

class OwnUser extends User {
    constructor(user){
        super(user);
        logger.debug('user loaded', user);
        if (user.attributes.accountType === undefined) {
            logger.info('OwnUser: Setting account type for user', user.uuid);
            var now = Date.now();
            var expiration = (365 * 24 * 60 * 60 * 1000) + now;
            var extraAttributes = {
                accountType: 1,
                accountTypeUpdated: now,
                accountTypeExpiration: expiration
            };
            Object.assign(this.user.attributes, extraAttributes);
            this.save();

        } else if (user.attributes.stripeId) {
            // check subscription status
            getSubscription(user.attributes.stripeId).then(({accountType, accountTypeExpiration, accountTypeUpdated})=>{
                logger.info('Own user with details', accountType, accountTypeExpiration, accountTypeUpdated);
                var extraAttributes = {
                    accountType,
                    accountTypeUpdated,
                    accountTypeExpiration
                };
                Object.assign(this.user.attributes, extraAttributes);
                this.save();
            });

        }

    }

    save(){
        logger.info('OwnUser: saved', this.user.uuid);
        user.saveUser(this.toJSON());
    }
}

class Users {

    constructor(){
        this.users = [];
    }

    loadUser(userId){
        return new Promise((resolve, reject) => {
            zzish.user(userId, (err, data) => {
                if (err) {
                    if (err === "404") {
                        reject('User not found');
                    }
                    reject(err);
                } else {
                    var user = new User(data);
                    this.users.push(user);
                    resolve(user.toJSON());
                }

            });
        });
    }

    loadUserBySlug(slug){
        return new Promise((resolve, reject) => {
            console.log('loading user', {profileUrl: slug});
            zzish.userByAttributes({profileUrl: slug}, (err, data) => {
                console.log('response', err, data);
                if (!err && typeof data === 'object' && data.length > 0) {
                    var user = new User(data[0]);
                    this.users.push(user);
                    resolve(user.toJSON());
                }
                else {
                    if (err === "404") {
                        reject('User not found');
                    }
                    reject(err);
                }
            });
        });
    }

    getUserBySlug(slug) {
        console.log('users', this.users);
        var user = this.users.filter(u=> slug === u.user.attributes.profileUrl)[0];
        if (user === undefined) {
            return this.loadUserBySlug(slug);
        } else {
            return user.toJSON();
        }
    }

    getUserByid(userId){
        var user = this.users.filter(u=> userId === u.user.uuid)[0];
        console.log('users?', this.users, user);
        if (user === undefined){
            console.log('form zzish');
            return this.loadUser(userId);
        } else {
            console.log('form chache');
            return user.toJSON();
        }
        // return new Promise((resolve, reject)=>{
        // });
    }

    getMyUser(profileId){
        return new Promise((resolve, reject)=>{
            zzish.user(profileId, function(err, data){
                if (!err && typeof data === 'object') {
                    var user = new OwnUser(data);
                    logger.debug('Own user loaded', user);
                    resolve(user.toJSON());
                }
                else {
                    reject(err);
                }
            });
        });
    }
}
var users = new Users();
export default users;
// var User = {
//     getUserByid: function(userId){
//        return new Promise(function(resolve, reject){
//            zzish.user(userId, function(err, data){
//                if (err) {
//                    reject(err);
//                } else {
//                    resolve(data);
//                }
//
//            });
//        });
//
//    }
// };
// export default User;
