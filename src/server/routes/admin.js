//general zzish config
var config = require("../config"); //initialized zzish
var email              = require('../email');
var APP_CONTENT_TYPE    = "app";
var async = require('async');
var db = require('./db');
var async = require("async");
var XLSX = require('xlsx');
var fs = require('fs');
var QUIZ_CONTENT_TYPE   = "quiz";
var generateData = require ('./generateData');
var GoogleAnalytics = require('ga');
var ua = process.env.QUIZALIZEGA;
var host = 'www.quizalize.com';
var ga = new GoogleAnalytics(ua, host);
var zzish = require('zzishsdk');

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
          email.sendEmailTemplate("'Quizalize Team' <team@quizalize.com>", [quizUser.email], 'Your ' + type + ' has been approved', type + doc, {
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
    console.log("Building page", zzish_db);
    zzish_db.secure.post("db/contentcategory/query/",{"query": "{}"}, function(err, categories){
        console.log("Fetching Categories");
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
    console.log("Building page", zzish_db);
    zzish_db.secure.post("db/contentcategory/query/",{"query": "{}"}, function(err, categories){
        console.log("Fetching Categories");
        //console.log(categories.length.payload);
        zzish_db.secure.post("db/subject/query/",{"query": "{}"}, function(err, subjects){
            zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'published'}"}, function(err, approved) {
                res.render("admin/approved", { approved: JSON.parse(approved.payload), categories: JSON.parse(categories.payload), subjects: JSON.parse(subjects.payload)});
            });
        });
    });

//});
};


exports.stats = function(req, res){
        // db.aggregateDocuments("content", [
        //     { $match: {"meta.published": "published", "ownerId": "72064f1f2cf84819a3d51193e52d928c"}},
        //     { $project: {"profileId": 1, "name": 1, "type": 1, "created": 1, "updated": 1}}], function(errContent, published){
        //             if (!errContent){
        //             db.aggregateDocuments("user", [
        //                 { $match: {"profile.appToken": "72064f1f2cf84819a3d51193e52d928c", "profile": { $exists: true}}},
        //                 { $project: { "uuid": 1, "profile": 1}}], function(errUser, users){
        //                 if(!errUser){
        //                     db.aggregateDocuments("usergroup", [
        //                         { $project: { "uuid": 1, "ownerId": 1}}],
        //                         function(errGroup, usergroup){
        //                             if (!errGroup){
        //                                 db.aggregateDocuments("activityinstance", [
        //                                     { $match: {"ownerId": "72064f1f2cf84819a3d51193e52d928c", "contentId": {$exists: true}, "status": "ACTIVITY_INSTANCE_COMPLETED"}},
        //                                     { $project: { "timestamp": 1, "contentId": 1, "groupId": 1}}],
        //                                     function(errActivity, mergedActivities){
        //                                         if (!errActivity) {
        //                                             res.render("admin/stats", {activities: mergedActivities, userGroups: usergroup, users: users, published: published});
        //                                         }
        //                                         else {
        //                                             res.render("admin/error", {error: errActivity});
        //                                         }
        //                                 });
        //                             }
        //                             else{
        //                                 res.render("admin/error", {error: errGroup});
        //                             }
        //
        //                     });
        //                 }
        //                 else {
        //                     res.render("admin/error", {error: errUser});
        //
        //                 }
        //             });
        //             }
        //             else {
        //                 res.render("admin/error", {error: errContent});
        //             }
        //     });
    var activityQuery = {"query":"{'ownerId': '72064f1f-2cf8-4819-a3d5-1193e52d928c', 'contentId': {$exists: true}, 'status': 'ACTIVITY_INSTANCE_COMPLETED'}",
    "project":"{'timestamp': 1, 'contentId': 1, 'groupId': 1, 'profileId': 1}"};

    zzish_db.secure.post("db/activityinstance/query/", activityQuery, function(err, activityinstances){
        console.log("Fetching activities");
        zzish_db.secure.post("db/user/query/", {"query": "{'profile.appToken': '72064f1f-2cf8-4819-a3d5-1193e52d928c', 'profile': {$exists: true}}",
                        "project": "{ 'uuid': 1, 'profile': 1, 'email': 1}"}, function(err, userList){
            zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'published', 'ownerId': '72064f1f-2cf8-4819-a3d5-1193e52d928c'}",
            "project": "{'profileId': 1, 'name': 1, 'type': 1, 'created': 1, 'updated': 1}"}, function(err, publishedList) {
                console.log("Fetching content");
                zzish_db.secure.post("db/usergroup/query/", {"query": "{}", "project":"{'uuid': 1, 'ownerId': 1}"}, function(err, usergroup) {
                    // var usersString = "#{JSON.stringify(users)}";
                    // usersString = usersString.replace(/&quot;/g, '"');
                    //
                    // var activitiesString = "#{JSON.stringify(activities)}";
                    // activitiesString = activitiesString.replace(/&quot;/g, '"');
                    //
                    // var userGroupString = "#{JSON.stringify(userGroup)}";
                    // userGroupString = userGroupString.replace(/&quot;/g, '"');
                    //
                    // var publishedString = "#{JSON.stringify(published)}";
                    // publishedString = publishedString.replace(/&quot;/g, '"');

                    var userGroups = JSON.parse(usergroup.payload);
                    var users = JSON.parse(userList.payload);
                    var activities = JSON.parse(activityinstances.payload);
                    var published = JSON.parse(publishedList.payload);

                    var today = Date.now();
                    var lastWeek = Date.now() - 7 * 24 * 60 * 60 * 1000;
                    var twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
                    var threeWeeksAgo = Date.now() - 21 * 24 * 60 * 60 * 1000;
                    var fourWeeksAgo = Date.now() - 28 * 24 * 60 * 60 * 1000;
                    var lastMonth = Date.now() - 30 * 24 * 60 * 60 * 1000;
                    var twoMonthsAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
                    var threeMonthsAgo = Date.now() - 91 * 24 * 60 * 60 * 1000;

                    var stats = {};
                    stats.activityWeek = 0;
                    stats.totalActivities = 0;
                    stats.totalQuizPlayed = activities.length;

                    var ownerIdFromGroupId = function (groupId, userGroups){
                        var userGroup = userGroups.filter(function (group){
                            return group.uuid === groupId;
                        })[0];
                        if (userGroup.ownerId === undefined){
                            return undefined;
                        }
                        else {

                            return userGroup.ownerId;
                        }
                    };
                    var emailFromOwnerId = function (ownerId, users){
                        var user = users.filter(function (teacher){
                            return teacher.uuid = ownerId;
                        })[0];
                        if (user === undefined){
                            return undefined;
                        }
                        else {
                            return user.profile.email;
                        }
                    };
                    var studentsFromActivities = function (activities, periodStart, periodEnd){
                        var students = {};
                        activities.forEach(function(activity){
                            if (activity.timestamp < periodEnd && activity.timestamp > periodStart){
                                if (activity.profileId !== undefined && activity.groupId !== undefined){
                                    if (students[activity.profileId] === undefined){
                                        students[activity.profileId] = {count: 1};
                                    }
                                    else {
                                        students[activity.profileId].count++ ;
                                    }
                                }

                            }
                        });
                        return students;
                    };
                    var previewersFromActivities = function (activities, periodStart, periodEnd){
                        var previewers = {};
                        activities.forEach(function(activity){
                            if (activity.timestamp < periodEnd && activity.timestamp > periodStart){
                                if (activity.profileId !== undefined && activity.groupId == undefined){
                                    if (previewers[activity.profileId] === undefined){
                                        previewers[activity.profileId] = {count: 1};
                                    }
                                    else {
                                        previewers[activity.profileId].count++ ;
                                    }
                                }

                            }
                        });
                        return previewers;
                    };
                    var teacherPreviewers = function(previewers, users){
                        var count = 0;
                        for (var previewer in previewers){
                            console.log("previewer", previewer);
                            users.forEach(function(user){
                                if(user.uuid === previewer && user.email !== undefined){
                                    count++;
                                }
                            });
                        }
                        return count;
                    };
                    var totalStudents = function(students){
                        var studentCount = 0;
                        for (var student in students){
                            if( students[student].count > 0){
                                studentCount++;
                            }
                        }
                        return studentCount;
                    };
                    var repeatStudents = function(students){
                        var repeatStudents = 0;
                        for (var student in students){
                            if( students[student].count > 1){
                                repeatStudents++;
                            }
                        }
                        return repeatStudents;
                    };
                    var activityGroupFromActivities = function (activities, periodStart, periodEnd){
                        var activityGroup = {};
                        activities.forEach(function(activity){
                            if (activity.timestamp < periodEnd && activity.timestamp > periodStart){
                                if (activity.groupId !== undefined){
                                    if (activityGroup[activity.groupId] === undefined){
                                        activityGroup[activity.groupId] = {count: 1};
                                    }
                                    else {
                                        activityGroup[activity.groupId].count++ ;
                                    }
                                }

                            }
                        });
                        return activityGroup;
                        console.log(activityGroup);

                    };
                    var activityCountFromActivities = function (activities, periodStart, periodEnd){
                        var count = 0;
                        activities.forEach(function(activity){
                            if (activity.timestamp < periodEnd && activity.timestamp > periodStart){
                                count++;
                            }
                        });
                        return count;
                    };
                    var activeClassesFromActivityGroup = function (activityGroup){
                        var activeClasses = 0;
                        for (var groupId in activityGroup){
                            if (activityGroup[groupId].count > 0){
                                activeClasses++;
                            }
                        }
                        return activeClasses;
                    };


                    var activeTeachersFromActivityGroup = function (activityGroup, userGroups){
                        var activeTeachers = {};
                        for (var groupId in activityGroup){
                            if (activityGroup[groupId].count > 2){
                                var ownerId = ownerIdFromGroupId(groupId, userGroups);
                                activityGroup[groupId].ownerId = ownerId;
                                console.log("ownerId", ownerId);
                                if(activeTeachers[ownerId] === undefined){
                                    activeTeachers[ownerId] = {activeClassCount: 1};
                                }
                                else {
                                    activeTeachers[ownerId].activeClassCount++;
                                }
                            }
                        };
                        return activeTeachers;
                    };
                    var powerUsersFromTeachers = function(activeTeachers) {
                        var powerUsers = {};
                        for (var teacher in activeTeachers){
                            if (activeTeachers[teacher].activeClassCount > 1){
                                powerUsers[teacher] = activeTeachers[teacher];
                                }
                            }
                        var powerUsersCount = Object.keys(powerUsers).length;
                        return powerUsersCount;
                    };

                    var publishedCounter = function (published, periodStart, periodEnd, type){
                        var count = 0;
                        published.forEach(function(content){
                            if (content.created > periodStart && content.created < periodEnd && content.type === type){
                                count++;
                                }
                        });
                        return count;
                    };
                    var publishersFromContent = function (published, date, type, users){
                        var publishers = {};
                        published.forEach(function(content){
                            if (content.created > date && content.type === type){
                                if(publishers[content.profileId] === undefined){
                                    publishers[content.profileId] = {content: 1, profileId: content.profileId, email: undefined};
                                }
                                else {
                                    publishers[content.profileId].content++;
                                }
                            }
                        });
                        for (var publisher in publishers){
                            var email = emailFromOwnerId(publishers[publisher].profileId, users);
                            console.log("email", email);
                            publishers[publisher].email = email;
                            }
                            console.log("publishersfinal", publishers);

                        return publishers;
                    };
                    var repeatUsers = function (teacherArray){
                            teacherArray.forEach(function(teacher){

                            });
                    };
                    stats.activityLastWeek = activityCountFromActivities(activities, lastWeek, today);
                    stats.activityTwoWeeksAgo = activityCountFromActivities(activities, twoWeeksAgo, lastWeek);
                    stats.activityThreeWeeksAgo = activityCountFromActivities(activities, threeWeeksAgo, twoWeeksAgo);
                    stats.activityLastMonth = activityCountFromActivities(activities, lastMonth, today);
                    stats.activityTwoMonthsAgo = activityCountFromActivities(activities, twoMonthsAgo, lastMonth);

                    //Active Classes
                    var activityGroupLastWeek = activityGroupFromActivities(activities, lastWeek, today);
                    console.log("activity", activityGroupLastWeek);
                    var activityGroupTwoWeeksAgo = activityGroupFromActivities(activities, twoWeeksAgo, lastWeek);
                    var activityGroupThreeWeeksAgo = activityGroupFromActivities(activities, threeWeeksAgo, twoWeeksAgo);
                    var activityGroupFourWeeksAgo = activityGroupFromActivities(activities, fourWeeksAgo , threeWeeksAgo);

                    var activityGroupLastMonth = activityGroupFromActivities(activities, lastMonth, today);
                    var activitityGroupTwoMonthsAgo = activityGroupFromActivities(activities, twoMonthsAgo, lastMonth);
                    stats.activeClassesLastWeek = activeClassesFromActivityGroup(activityGroupLastWeek);
                    stats.activeClassesTwoWeeksAgo = activeClassesFromActivityGroup(activityGroupTwoWeeksAgo);
                    stats.activeClassesLastMonth = activeClassesFromActivityGroup(activityGroupLastMonth);
                    stats.activeClassesTwoMonthsAgo = activeClassesFromActivityGroup(activitityGroupTwoMonthsAgo);
                    stats.activeClassesThreeWeeksAgo = activeClassesFromActivityGroup(activityGroupThreeWeeksAgo);
                    stats.activeClassesFourWeeksAgo = activeClassesFromActivityGroup(activityGroupFourWeeksAgo);

                    //Active Teachers
                    var activeTeachersLastWeek = activeTeachersFromActivityGroup(activityGroupLastWeek, userGroups);
                    var activeTeachersTwoWeeksAgo = activeTeachersFromActivityGroup(activityGroupTwoWeeksAgo, userGroups);
                    var activeTeachersThreeWeeksAgo = activeTeachersFromActivityGroup(activityGroupThreeWeeksAgo, userGroups);
                    var activeTeachersFourWeeksAgo = activeTeachersFromActivityGroup(activityGroupFourWeeksAgo, userGroups);
                    var activeTeachersLastMonth = activeTeachersFromActivityGroup(activityGroupLastMonth, userGroups);
                    var activeTeachersTwoMonthsAgo = activeTeachersFromActivityGroup(activitityGroupTwoMonthsAgo, userGroups);
                    stats.activeTeachersLastWeek = Object.keys(activeTeachersLastWeek).length;
                    stats.activeTeachersTwoWeeksAgo = Object.keys(activeTeachersTwoWeeksAgo).length;
                    stats.activeTeachersThreeWeeksAgo = Object.keys(activeTeachersThreeWeeksAgo).length;
                    stats.activeTeachersFourWeeksAgo = Object.keys(activeTeachersFourWeeksAgo).length;
                    stats.activeTeachersLastMonth = Object.keys(activeTeachersLastMonth).length;
                    stats.activeTeachersTwoMonthsAgo = Object.keys(activeTeachersTwoMonthsAgo).length;
                    //students
                    var studentsLastMonth = studentsFromActivities(activities, lastMonth, today);
                    stats.studentsLastMonth = totalStudents(studentsLastMonth);
                    console.log("students", stats.studentsLastMonth);
                    var previewersThreeMonths = previewersFromActivities(activities, threeMonthsAgo, today);
                    console.log("previewers", Object.keys(previewersThreeMonths).length);
                    var teachPrevThree = teacherPreviewers (previewersThreeMonths, users);
                    console.log("teachPrev", teachPrevThree);

                    stats.repeatStudentsLastMonth = repeatStudents(studentsLastMonth);

                    stats.powerUsersLastWeek = powerUsersFromTeachers(activeTeachersLastWeek);
                    stats.powerUsersTwoWeeksAgo = powerUsersFromTeachers(activeTeachersTwoWeeksAgo);
                    stats.publishedQuizThisWeek = publishedCounter(published, lastWeek, today, "quiz");
                    stats.publishedAppThisWeek = publishedCounter(published, lastWeek, today, "app");
                    stats.publishedQuizzes = published.length;
                    var quizPublishers = publishersFromContent(published, 0, "quiz", users);
                    stats.quizPublishersCount = Object.keys(quizPublishers).length;
                    var appPublishers = publishersFromContent(published, lastWeek, "app", users);
                    stats.appPublishersCount = Object.keys(appPublishers).length;
                //    var powerUsers = powerUsersFromTeachers(activeTeachers);
                //    stats.powerUsersTally = Object.keys(powerUsers).length;

                    res.render("admin/stats", {stats: stats});
                });
            });
        });
    });
};
exports.metrics = function (req, res){
    db.findDocuments("metrics",{}, -1, function(err, metrics) {
        metrics.sort(function(x, y){
            if (!x._id) {
                return -1;
            }
            if (!y._id) {
                return 1;
            }
            return y._id - x._id;
        });
        res.render("admin/metrics", {metrics: metrics});


    });
};
exports.emailList = function (req, res){
    db.findDocuments("metrics",{}, -1, function(err, metrics) {
        metrics.sort(function(x, y){
            if (!x._id) {
                return -1;
            }
            if (!y._id) {
                return 1;
            }
            return y._id - x._id;
        });
        res.render("admin/emailList", {metrics: metrics});


    });
};



exports.data = function (req, res){
    generateData(req.body.timestamp,function(result) {
        res.send(result);
    });
};

exports.newMetric = function(req, res){
    db.findDocuments("metrics",{}, -1, function(err, metrics) {
        metrics.sort(function(x, y){
            if (!x._id) {
                return -1;
            }
            if (!y._id) {
                return 1;
            }
            return y._id - x._id;
        });
        res.render("admin/newmetric", {metrics: metrics});


    });
};




exports.submitmetrics = function(req, res){
    var result = req.body;
    console.log("Submitting");
    generateData(result._id, function(data) {
        //console.log("data",data);
        for (var i in data) {
            result[i] = data[i];
        };
        console.log(result);

        db.saveDocument("metrics", result, function(err, result) {
            res.send("OK"+" err:" + err + " result:" + result);
        });
    });
};

exports.approve = function(req, res){
    approveDocument(req, res, 'published');
};

exports.approvefirst = function(req, res){
    approveDocument(req, res, 'firstpublished');
};

//body, link, linktitle
var parseHash = function(input, params) {
    for (var i in params) {
		var patt = new RegExp("%" + i + "%", "g" );
		if (input !== undefined) {
			input = input.replace(patt, params[i]);
		}
	}
	return input;
};

exports.emailpage = function(req, res){
    res.render("admin/emails");
};

exports.email = function(req, res){
    var emails = req.body.emails;
    var params = req.body.params;
    var body = req.body.body;
	body = body.replace(/(?:\r\n|\r|\n)/g, '<br />');

    console.log("BODY", req.body);

    async.eachSeries(emails, function(user, callback) {
        var subject = parseHash(parseHash(req.body.subject,params), user);
        params.body = parseHash(parseHash(body,params), user);
        for (var j in user) {
            params[j] = user[j];
        }
        email.sendEmailTemplate("'Quizalize Team' <team@quizalize-mail.com>", [user.email], subject, "email", params, null, callback);
    }, function(done) {
        res.send("Done");
    });
};

exports.xlsx = function(req,res) {
    console.log("XLS");
    var output = "";
    var workbook = XLSX.readFile(__dirname + "/" + req.body.filename);
    for (var j = 62; j< workbook.SheetNames.length;j++) {
        var first_sheet_name = workbook.SheetNames[j];
        /* Get worksheet */
        var worksheet = workbook.Sheets[first_sheet_name];
        var currentP = "";
        for (var row = 1; row < 65; row ++) {

            var address_of_cell = 'A' + row;
            /* Find desired cell */
            var desired_cell = worksheet[address_of_cell];
            if (desired_cell) {
                /* Get the value */
                var desired_value = ""+desired_cell.v;
                if (desired_value.indexOf("Principal:")==0) {
                    currentP = desired_value.substring(11);
                }
                if (desired_value.indexOf("E-mail:")==0) {
                    output+=currentP + "    " + desired_value.substring(8)+"\n";
                }
            }
        }
        for (var row =1; row < 65; row ++) {
            var address_of_cell = 'C' + row;

            /* Find desired cell */
            var desired_cell = worksheet[address_of_cell];
            if (desired_cell) {
                /* Get the value */
                var desired_value = ""+desired_cell.v;
                if (desired_value.indexOf("Principal:")==0) {
                    currentP = desired_value.substring(11);
                }
                if (desired_value.indexOf("Email:")==0) {
                    console.log(desired_value, currentP);
                    output+=currentP + "    " + desired_value.substring(8)+"\n";
                }
            }
        }
    }
    fs.writeFileSync(__dirname + "utah.out", output);
    res.send("Done");
};


exports.pixeltest = function(req,res) {
    res.render("admin/pixel");
};

exports.pixel = function(req,res) {
    ga.trackEvent(req.query);
    var buf = new Buffer("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", 'base64');
    res.end(buf);
};

exports.unsubscribe = function(req,res) {
    email.sendEmailTemplate('team@zzish.com', ['vini@zzish.com'], 'Unsubscribe', 'unsubscribe', {email: req.query.email});
    res.send("Your email has been unsubscribed.");
};
