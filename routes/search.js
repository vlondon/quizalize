//general zzish config
var zzish               = require("zzishsdk");
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

            userHelper.addUserToExtra(resp)
                .then(function(listOfItems){
                    res.send(listOfItems);
                }).catch(function(error){
                    res.status(500).send(error);
                });
        } else {
            res.status(500).send(err);
        }
    });

};



exports.getApps = function(req, res){

    var searchString = req.body.search || '';
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
        if (resp) {

            resp.sort(function(a, b){ return b.meta.updated - a.meta.updated; });

            // res.send(resp);
            userHelper.addUserToExtra(resp)
                .then(function(listOfItems){
                    res.send(listOfItems);
                }).catch(function(error){
                    res.status(500).send(error);
                });
        } else {
            res.status(500).send(err);
        }
    });


};
