//general zzish config
var uuid                = require('node-uuid');
var zzish               = require("zzishsdk");
var Promise             = require('es6-promise').Promise;
var userHelper          = require('./helpers/userHelper');

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


    if (categoryId) {
        mongoQuery.categoryId = categoryId;
    }

    zzish.searchPublicContent(QUIZ_CONTENT_TYPE, mongoQuery, function(err, resp){

        if (resp) {

        var listOfAuthors = resp.map(function(quiz){
            return quiz.meta.profileId;
        });

        userHelper.getUsersFromIds(listOfAuthors)
            .then(function(authors){
                resp.forEach(function(quiz){
                    var authorId = quiz.meta.profileId;
                    var author = authors.filter(function(a){ return a.uuid === authorId; })[0];
                    quiz.extra = {
                        author: author
                    };
                    console.log('listOfAuthors',  authors, author);
                });
                res.send(resp);
            }).catch(function(error){
                res.status(500).send(error);
            });
        } else {
            res.status(500).send(err);
        }
    });

};



exports.getApps = function(req, res){

    var searchString = req.body.search;
    var categoryId = req.body.categoryId;
    var appId = req.body.appId;

    var now = Date.now();
    var lastWeek = now - 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        updated: {
            $gt: lastWeek
        },
        name: {
            $regex: searchString, $options: 'i'
        }

    };

    if (categoryId) {
        mongoQuery.categoryId = categoryId;
    }
    // if (appId){
    //     mongoQuery.uuid = appId;
    // }
    console.log('searching ', mongoQuery);

    zzish.searchPublicContent(APP_CONTENT_TYPE, mongoQuery, function(err, resp){
        res.send(resp);
    });


};
