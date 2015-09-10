var zzish = require("../../zzish");
// var user = require('./../../user');

class User {

    constructor(user){
        // Object.assign(this, user);
        this.user = user;
        this.uuid = user.uuid;
        this._userQuizzesInit = false;
    }

    toJSON(){
        return this;
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

class Users {

    constructor(){
        console.log('preparing new users');
        this.users = [];
    }

    loadUser(userId){
        return new Promise((resolve, reject) => {
            zzish.user(userId, (err, data) => {
               if (err) {
                   reject(err);
                } else {
                    var user = new User(data);
                    this.users.push(user);
                    resolve(user.toJSON());
                }

            });
        });
    }


    getUserByid(userId){
        var user = this.users.filter(u=> userId === u.uuid)[0];
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
