//general zzish config
var uuid                = require('node-uuid');
var zzish               = require("zzishsdk");
var Promise             = require('es6-promise').Promise;

var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = 'quiz';


exports.get = function(req, res){

    var now = Date.now();
    var lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        $gt: lastWeek
    };

    zzish.searchPublicContent(QUIZ_CONTENT_TYPE, {updated: mongoQuery}, function(err, resp){
        res.send(resp);
    });
};
