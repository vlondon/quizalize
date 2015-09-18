//general zzish config
var zzish               = require("zzishsdk");
var userHelper          = require('./helpers/userHelper');
var logger              = require('../logger');

var TRANSACTION_CONTENT_TYPE = "transaction";
var QUIZ_CONTENT_TYPE = 'quiz';
var APP_CONTENT_TYPE = 'app';

var performQuery = function(mongoQuery,callback) {
    zzish.searchPublicContent(QUIZ_CONTENT_TYPE, mongoQuery, function(err, resp){
        if (resp) {
            userHelper.addUserToExtra(resp)
                .then(function(listOfItems){
                    callback(null,listOfItems);
                }).catch(function(error){
                    callback(400,error);
                });
        } else {
            callback(500,error);
        }
    });
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
    var lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;
    var mongoQuery = {
        updated: {
            $gt: lastYear
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
                $gt: lastYear
            },
            published: "published",
            subjectId: { $in: usedSubsId }
        };
        performQuery(mongoQuery, function(err,result) {
            if (err === null) {
                performQuery(mongoQuery2,function(err,result2) {
                    if (err === null) {
                        result = result.concat(result2);
                        Array.prototype.push.apply(result, result2);
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
        performQuery(mongoQuery,function(err,result) {
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
    logger.trace('searching ', mongoQuery);

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
