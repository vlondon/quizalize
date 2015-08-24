//general zzish config
var zzish = require("../zzisha"); //initialized zzish
var config = require("../config"); //initialized zzish
var email              = require('../email');
var APP_CONTENT_TYPE    = "app";
var async = require('async');
var QUIZ_CONTENT_TYPE   = "quiz";

if (process.env.admin=="true") {
    var Zzish = require('zzish');
    var zzish_db = new Zzish();
    var adminResult = {
        apiUrl: config.apiUrlAdmin,
        appToken: config.appTokenAdmin,
        wso2: "true",
        log: false
    };
    console.log("Init", adminResult);
    zzish_db.init(adminResult);
}



var finalApproval = function(req, res, type, content, doc) {
    content.meta.published = "published";
    content.meta.updated = Date.now();
    if (req.body.subjectId) {
      content.meta.subjectId = req.body.subjectId;
    }
    if (req.body.publicCategoryId) {
      content.meta.publicCategoryId = req.body.publicCategoryId;
    }
    zzish.postContent(content.meta.profileId, type, content.uuid, content.meta, content.payload, function(err2, resp) {
      if (!err2) {
        zzish.getUser(content.meta.profileId, null, function(err3, quizUser) {
          var name = quizUser.name ? quizUser.name : 'there';
          email.sendEmailTemplate('team@quizalize.com', [quizUser.email], 'Your ' + type + ' has been approved', type + doc, {
            name: name,
            type: type,
            quiz: content.meta.name,
            profilelink: 'http://www.quizalize.com/quiz/user/' + quizUser.uuid
          });
          res.send("Done");
        });
      }
      else {
        res.send("Error", err2, resp);
      }
    });
};

var approveDocument = function(req, res, doc) {
    var id = req.params.id;
    var type = req.params.type;

    zzish.getPublicContent(type, id, function(err1, content) {
      if (!err1) {
        if (content.meta.published !== "published") {
          if (type === APP_CONTENT_TYPE) {
            async.eachSeries(content.payload.quizzes, function (quizId, icallback) {
              zzish.getPublicContent(QUIZ_CONTENT_TYPE, quizId, function(err2, quiz) {
                if (!err2) {
                  if (quiz.meta.published !== "published") {
                    quiz.meta.published = "published";
                    quiz.meta.updated = Date.now();
                    if (req.body.subjectId) {
                      quiz.meta.subjectId = req.body.subjectId;
                    }
                    if (req.body.publicCategoryId) {
                      quiz.meta.publicCategoryId = req.body.publicCategoryId;
                    }
                  }
                  zzish.postContent(quiz.meta.profileId, QUIZ_CONTENT_TYPE, quiz.uuid, quiz.meta, quiz.payload, function(err3) {
                    icallback(err3);
                  });
                }
              });
            }, function(err3){
                // if any of the file processing produced an error, err would equal that error
                if (!err3) {
                  finalApproval(req, res, type, content, doc);
                }
            });
          }
          else {
            finalApproval(req, res, type, content, doc);
          }
        }
        else {
          res.send("Already Published" + content.meta.published);
        }
      }
    });
};

exports.index = function(req, res){
    res.render("admin/index");
};

exports.pendingQuizzes = function(req, res){
    // db.findDocuments("subject",{}, 1, function(err, subjects) {
    //     var subjectArray = subjects.map(function(item) {
    //         return {uuid: item.uuid, name: item.name};
    //     });
    //     //subjectArray = [];
    //     console.log("I got subjects", subjectArray.length);
    //     db.findDocuments("contentcategory",{subjectId: {$exists: true}}, 1, function(err, categories) {
    //         var categoryArray = categories.map(function(item) {
    //             return {uuid: item.uuid, name: item.name};
    //         });
    //         //categoryArray = [];
    //         console.log("I got categories", categoryArray.length);
    //         db.findDocuments("content", {"meta.published": "pending"}, 1, function(err, pending) {
    //             var contentArray = pending.map(function(item) {
    //                 return {uuid: item.uuid, meta: item.meta, updated: item.updated, type: item.type};
    //             });
    //             console.log(contentArray.length);
    //             //var contentArray = [];
    //             if (!err) {
    //                 //res.render("admin/error", {error: categoryArray});
    //                 res.render("admin/pending1", {pending: contentArray, categories: categoryArray, subjects: subjectArray});
    //             }
    //             else {
    //                 res.render("admin/error", {error: err});
    //             }
    //         });
    //     });
    // });
    // db.findDocuments("contentcategory",{subjectId: {$exists: true}}, 1, function(err, categories) {
    //     var categoryArray = categories.map(function(item) {
    //         return {uuid: item.uuid, name: item.name};
    //     });
    //     categoryArray = categoryArray.slice(0,5);
    //     //categoryArray = [];
    //     console.log("I got categories", categoryArray.length);
    //     db.findDocuments("subject",{}, 1, function(err, subjects) {
    //         var subjectArray = subjects.map(function(item) {
    //             return {uuid: item.uuid, name: item.name};
    //         });
    //         subjectArray = subjectArray.slice(0,5);
    //         //subjectArray = [];
    //         console.log("I got subjects", subjectArray.length);
    //         db.findDocuments("content", {"meta.published": "pending"}, 1, function(err, pending) {
    //             var contentArray = pending.map(function(item) {
    //                 return {uuid: item.uuid, meta: item.meta, updated: item.updated, type: item.type};
    //             });
    //             //var contentArray = [];
    //             contentArray = contentArray.slice(0,5);
    //             console.log("I got content",contentArray.length);
    //             if (!err) {
    //                 //res.render("admin/error", {error: categoryArray});
    //                 res.render("admin/pending1", {pending: contentArray, categories: categoryArray, subjects: subjectArray});
    //             }
    //             else {
    //                 res.render("admin/error", {error: err});
    //             }
    //         });
    //     });
    // });
    zzish_db.secure.post("db/contentcategory/query/",{"query": "{}"}, function(err, categories){
        //console.log(categories.length.payload);
        zzish_db.secure.post("db/subject/query/",{"query": "{}"}, function(err, subjects){
            zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'pending'}"}, function(err, pending) {
                res.render("admin/pending", { pending: JSON.parse(pending.payload), categories: JSON.parse(categories.payload), subjects: JSON.parse(subjects.payload)});
            });
        });
    });
};

exports.approved = function(req, res){
    // db.aggregateDocuments("contentcategory", [{ $project: {"uuid": 1, "name": 1}}], function(errCategory, categories){
    // if (!errCategory){
    //     db.findDocuments("content", {"meta.published": "published"}, 1, function(errContent, approved) {
    //         if (!errContent) {
    //             approved.sort(function(x, y){
    //                 if (!x.updated) {
    //                     return 1;
    //                 }
    //                 if (!y.updated) {
    //                     return 1;
    //                 }
    //                 return y.updated  x.updated;
    //             });
    //             res.render("admin/approved", {approved: approved, categories: categories});
    //         }
    //         else {
    //             res.render("admin/error", {error: errContent});
    //         }
    //     });
    // }
    // else {
    //     res.render("admin/error", {error: errCategory});
    // }

    zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'published'}"}, function(err, pending) {
        res.render("admin/approved", {approved: JSON.parse(pending.payload)});
    });

//});
};


// exports.stats = function(req, res){
//     db.aggregateDocuments("content", [
//         { $match: {"meta.published": "published", "ownerId": "72064f1f2cf84819a3d51193e52d928c"}},
//         { $project: {"profileId": 1, "name": 1, "type": 1, "created": 1, "updated": 1}}], function(errContent, published){
//                 if (!errContent){
//                 db.aggregateDocuments("user", [
//                     { $match: {"profile.appToken": "72064f1f2cf84819a3d51193e52d928c", "profile": { $exists: true}}},
//                     { $project: { "uuid": 1, "profile": 1}}], function(errUser, users){
//                     if(!errUser){
//                         db.aggregateDocuments("usergroup", [
//                             { $project: { "uuid": 1, "ownerId": 1}}],
//                             function(errGroup, usergroup){
//                                 if (!errGroup){
//                                     db.aggregateDocuments("activityinstance", [
//                                         { $match: {"ownerId": "72064f1f2cf84819a3d51193e52d928c", "contentId": {$exists: true}, "status": "ACTIVITY_INSTANCE_COMPLETED"}},
//                                         { $project: { "timestamp": 1, "contentId": 1, "groupId": 1}}],
//                                         function(errActivity, mergedActivities){
//                                             if (!errActivity) {
//                                                 res.render("admin/stats", {activities: mergedActivities, userGroups: usergroup, users: users, published: published});
//                                             }
//                                             else {
//                                                 res.render("admin/error", {error: errActivity});
//                                             }
//                                     });
//                                 }
//                                 else{
//                                     res.render("admin/error", {error: errGroup});
//                                 }
//
//                         });
//                     }
//                     else {
//                         res.render("admin/error", {error: errUser});
//
//                     }
//                 });
//                 }
//                 else {
//                     res.render("admin/error", {error: errContent});
//                 }
//         });
//  };


exports.approve = function(req, res){
  approveDocument(req, res, 'published');
};

exports.approvefirst = function(req, res){
  approveDocument(req, res, 'firstpublished');
};
