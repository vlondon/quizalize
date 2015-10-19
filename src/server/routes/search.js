//general zzish config
var zzish               = require("zzishsdk");
var userHelper          = require('./helpers/userHelper');
var logger              = require('../logger');

var cache = {};
var cacheCount = 0;
var maxCache = 5;

var QUIZ_CONTENT_TYPE = 'quiz';
var APP_CONTENT_TYPE = 'app';

var performQuery = function(mongoQuery,contenType,callback) {
    var queryString = JSON.stringify(mongoQuery);
    console.log("Query", contenType, queryString);
    if (!cache[contenType]) {
        cache[contenType] = {};
    }
    if (cache[contenType][queryString]) {
        callback(null,cache[contenType][queryString]);
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
                        callback(null,listOfItems);
                    }).catch(function(error){
                        callback(400,error);
                    });
            } else {
                callback(500,resp);
            }
        });
    }
};


exports.getQuizzes = function(req, res){

    var searchString = req.body.search || '';
    var categoryId = req.body.categoryId;
    var profileId = req.body.profileId;

    var subjects = req.body.subjects;



    var patt = new RegExp(searchString,"i");
    var usedSubs = subjects.filter(function(subject) {
        return searchString!=='' && patt.test(subject.name);
    });

    var now = Date.now();
    //var lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        updated: {
            $gt: 1
        },
        published: "published",
        name: {
            $regex: searchString, $options: 'i'
        }
    };
    if (categoryId) {
        mongoQuery.subjectId = categoryId;
    }
    if (profileId) {
        mongoQuery.profileId = profileId;
    }

    if (usedSubs.length > 0) {
        var usedSubsId = usedSubs.map(function(item) {
            return item.uuid;
        });
        var mongoQuery2 = {
            updated: {
                $gt: 1
            },
            published: "published",
            subjectId: { $in: usedSubsId }
        };
        performQuery(mongoQuery, QUIZ_CONTENT_TYPE, function(err,result) {
            if (err === null) {
                performQuery(mongoQuery2, QUIZ_CONTENT_TYPE, function(err,result2) {
                    if (err === null) {
                        result2.forEach(function(quiz) {
                            var filtered = result.filter(function(rresult) {
                                return rresult.uuid == quiz.uuid;
                            });
                            if (filtered.length == 0) {
                                result.push(quiz);
                            }
                        });
                        //Array.prototype.push.apply(result, result2);
                        res.send(result);
                    }
                    else {
                        res.status(500).send(result2);
                    }
                });
            }
            else {
                res.status(500).send(result);
            }
        });
    }
    else {
        performQuery(mongoQuery,QUIZ_CONTENT_TYPE, function(err,result) {
            if (err === null) {
                res.send(result);
            }
            else {
                res.status(500).send(result);
            }
        });
    }
    //mongoQuery.published = true;
};



exports.getApps = function(req, res){
    var searchString = req.body.search || '';
    var categoryId = req.body.categoryId;
    var appId = req.body.appId;

    var now = Date.now();
    var mongoQuery = {
        updated: {
            $gt: 1
        },
        published: "published",
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
    logger.trace('searching ', mongoQuery);

    performQuery(mongoQuery, APP_CONTENT_TYPE, function(err,result) {
        if (err === null) {
            res.send(result);
        }
        else {
            res.status(500).send(result);
        }
    });
};
