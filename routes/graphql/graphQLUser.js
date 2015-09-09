var zzish = require("../../zzish");
// var user = require('./../../user');

var User = {
    getUserByid: function(userId){
       return new Promise(function(resolve, reject){
           zzish.user(userId, function(err, data){
               if (err) {
                   reject(err);
               } else {
                   resolve(data);
               }

           });
       });

   }
};
export default User;
