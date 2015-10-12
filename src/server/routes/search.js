//general zzish config
var zzish               = require("zzishsdk");
var userHelper          = require('./helpers/userHelper');
var logger              = require('../logger');

var marketplaceSearch = require('./helpers/marketplaceContent');

var cache = {};
var cacheCount = 0;
var maxCache = 5;

var QUIZ_CONTENT_TYPE = 'quiz';
var APP_CONTENT_TYPE = 'app';

var performQuery = function(mongoQuery, contenType, callback) {
    var queryString = JSON.stringify(mongoQuery);

    console.log("Query", contenType, queryString);

    if (!cache[contenType]) {
        cache[contenType] = {};
    }
    if (cache[contenType][queryString]) {
        callback(null, cache[contenType][queryString]);
    }
    else {
        zzish.searchPublicContent(contenType, mongoQuery, function(err, resp){
            if (resp) {
                resp.sort(function(a, b){ return b.meta.updated - a.meta.updated; });

                userHelper.addUserToExtra(resp)
                    .then(function(listOfItems){
                        if (cacheCount < maxCache) {
                            cache[contenType][queryString] = listOfItems;
                            cacheCount++;
                        }
                        callback(null, listOfItems);
                    }).catch(function(error){
                        callback(400, error);
                    });
            } else {
                callback(500, error);
            }
        });
    }
};


exports.getQuizzes = function(req, res){

    var searchString = req.body.search || '';

    logger.info('getQuizzes');
    var quizzes = marketplaceSearch.quiz(searchString);
    res.send(quizzes);

};



exports.getApps = function(req, res){
    var searchString = req.body.search || '';


    let apps = marketplaceSearch.app(searchString);
    res.send(apps);
    // if (categoryId) {
    //     mongoQuery.categoryId = categoryId;
    // }
    // // if (appId){
    // //     mongoQuery.uuid = appId;
    // // }
    // logger.trace('searching ', mongoQuery);
    //
    // performQuery(mongoQuery, APP_CONTENT_TYPE, function(err,result) {
    //     if (err === null) {
    //         res.send(result);
    //     }
    //     else {
    //         res.status(500).send(result);
    //     }
    // });
};
