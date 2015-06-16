//general zzish config
var uuid                = require('node-uuid');
var zzish               = require("zzishsdk");
var Promise             = require('es6-promise').Promise;

var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = 'quiz';
var APP_CONTENT_TYPE = 'app';


exports.getQuizzes = function(req, res){

    var searchString = req.body.search || '';
    var categoryId = req.body.categoryId;

    var now = Date.now();
    var lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        updated: {
            $gt: lastWeek
        },
        live: true,
        name: {
            $regex: searchString, $options: 'i'
        }

    };
    console.log('searching ', mongoQuery);

    if (categoryId) {
        mongoQuery.categoryId = categoryId;
    }

    zzish.searchPublicContent(QUIZ_CONTENT_TYPE, mongoQuery, function(err, resp){
        res.send(resp);
    });

};



exports.getApps = function(req, res){

    var searchString = req.body.search;
    var categoryId = req.body.categoryId;

    var now = Date.now();
    var lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        // updated: {
        //     $gt: lastWeek
        // },
        name: {
            $regex: searchString, $options: 'i'
        }

    };

    if (categoryId) {
        mongoQuery.categoryId = categoryId;
    }

    zzish.searchPublicContent(APP_CONTENT_TYPE, mongoQuery, function(err, resp){
        res.send(resp);
    });

};
