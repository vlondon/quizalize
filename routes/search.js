//general zzish config
var zzish               = require("zzishsdk");
var userHelper          = require('./helpers/userHelper');

var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = 'quiz';
var APP_CONTENT_TYPE = 'app';

var performQuery = function(mongoQuery,res) {
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
}


exports.getQuizzes = function(req, res){

    var searchString = req.body.search || '';
    var categoryId = req.body.categoryId;
    var profileCode = req.body.profileCode;

    var now = Date.now();
    var lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        updated: {
            $gt: lastYear
        },
        live: true,
        name: {
            $regex: searchString, $options: 'i'
        }

    };


    if (categoryId) {
        mongoQuery.categoryId = categoryId;
    }
    if (profileCode) {
        zzish.getUserByCode(profileCode,function(err,resp) {
            mongoQuery.profileId = resp.uuid;
            performQuery(mongoQuery,res);
        })
    }
    else {
        performQuery(mongoQuery,res);
        //mongoQuery.published = true;
    }
};



exports.getApps = function(req, res){

    var searchString = req.body.search || '';
    var categoryId = req.body.categoryId;
    var appId = req.body.appId;

    var now = Date.now();
    var lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        updated: {
            $gt: lastYear
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
