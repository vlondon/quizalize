//general zzish config
var zzish = require("../zzisha"); //initialized zzish
var config = require("../config"); //initialized zzish
var email              = require('../email');
var APP_CONTENT_TYPE    = "app";
var async = require('async');
var db = require('./db');
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
    console.log(zzish);
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

    zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'published'}"}, function(err, pending) {
        res.render("admin/approved", {approved: JSON.parse(pending.payload)});
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

var generateData = function(chosenWeek, callback) {
    var activityQuery = {"query":"{'ownerId': '72064f1f-2cf8-4819-a3d5-1193e52d928c', 'contentId': {$exists: true}, 'status': 'ACTIVITY_INSTANCE_COMPLETED'}",
    "project":"{'timestamp': 1, 'contentId': 1, 'groupId': 1, 'profileId': 1}"};
    console.log("Generating data");
    zzish_db.secure.post("db/activityinstance/query/", activityQuery, function(err, activityinstances){
        console.log(err, "Fetching activities");
        zzish_db.secure.post("db/user/query/", {"query": "{'profiles.appToken': '72064f1f-2cf8-4819-a3d5-1193e52d928c', 'profile': {$exists: true}}",
                        "project": "{ 'uuid': 1, 'profiles':1, 'created': 1, 'email': 1}"}, function(err, userList){
                console.log("Fetching Users");
                zzish_db.secure.post("db/usergroup/query/", {"query": "{}", "project":"{'uuid': 1, 'ownerId': 1}"}, function(err, usergroup) {
                    console.log("Got Groups");
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

                    var oneWeekBefore = chosenWeek - 7 * 24 * 60 * 60 * 1000;
                    var twoWeeksBefore = chosenWeek - 14 * 24 * 60 * 60 * 1000;
                    var fourWeeksBefore = chosenWeek - 28 * 24 * 60 * 60 * 1000;


                    var signUps = function(users, periodStart, periodEnd){
                        var count = 0;
                        users.forEach(function(user){
                            if(user.created > periodStart && user.created < periodEnd && user.email !== undefined) {
                                count++;
                            }
                        });
                        return count;
                    };
                    var activeSchools = function (users, periodEnd){
                            var schools = {};
                            users.forEach(function(user){
                                if(user.email !== undefined && user.created < periodEnd){
                                    var domain = user.email.split("@")[1];
                                    if (schools[domain] === undefined){
                                        schools[domain] = {domain: domain, count: 1};

                                    }
                                    else {
                                        schools[domain].count++;
                                    }
                                }
                                else if (user.profiles.email !== undefined && user.created < periodEnd){
                                    var domain = user.email.split("@")[1];
                                    if (schools[domain] === undefined){
                                        schools[domain] = {domain: domain, count: 1};

                                    }
                                    else {
                                        schools[domain].count++;
                                    }
                                }
                            });
                            return schools;
                    };

                    var signUpsGroup = function(users, periodStart, periodEnd){
                        var signUpTeachers = {};
                        users.forEach(function(user){
                            if(user.created > periodStart && user.created < periodEnd && user.email !== undefined) {
                                signUpTeachers[user.uuid]= {uuid: user.uuid, created: user.created};
                            }
                        });
                        return signUpTeachers;
                    };

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

                    };




                    var activeTeachersFromActivityGroup = function (activityGroup, userGroups){
                        var activeTeachers = {};
                        for (var groupId in activityGroup){
                            if (activityGroup[groupId].count > 0){
                                var ownerId = ownerIdFromGroupId(groupId, userGroups);
                                activityGroup[groupId].ownerId = ownerId;
                                if(activeTeachers[ownerId] === undefined){
                                    activeTeachers[ownerId] = {activeClassCount: 1, ownerId: ownerId};
                                }
                                else {
                                    activeTeachers[ownerId].activeClassCount++;
                                }
                            }
                        };
                        return activeTeachers;
                    };



                    var repeatUsers = function (teacherArray){
                            var teacherWeek = teacherArray[0];
                            var teacherMonth = teacherArray[1];
                            var repeat = {};
                            for (var teacher in teacherWeek){
                                for (var oldTeacher in teacherMonth){
                                    if (teacher === oldTeacher){
                                        if (repeat[teacher] === undefined){
                                            repeat[teacher] = {ownerId : teacher};
                                        }
                                    }

                                };
                            };
                            console.log("repeat", repeat);
                            return repeat;

                    };

                    var retainedUsers = function (repeat, users, periodStart, periodEnd){
                        var signUpsMonth = signUpsGroup(users, periodStart, periodEnd);
                        console.log("running retained");
                        var count = 0;
                        for (var rep in repeat){
                            for (var sign in signUpsMonth){
                                if(signUpsMonth[sign].uuid === repeat[rep].ownerId){
                                    count++;
                                }
                            }

                        }
                        return count;
                    };

                    // var activatedThisWeek = function (activeTeachers, signUps){
                    //     var count;
                    //     for (var teacher in activeTeachers){
                    //         for (var signUp in signUps){
                    //             if (activeTeachers[teacher].ownerId === signUps[signUp].uuid){
                    //                 count++;
                    //             }
                    //         }
                    //     }
                    //     return count;
                    // };

                    //Active Classes
                    var activityGroup = [];
                    activityGroup[0] = activityGroupFromActivities(activities, oneWeekBefore, chosenWeek);
                    activityGroup[1] = activityGroupFromActivities(activities, twoWeeksBefore, oneWeekBefore);

                    //Active Teachers
                    var activeTeachers = [];
                    activeTeachers[0] = activeTeachersFromActivityGroup(activityGroup[0], userGroups);
                    console.log("activeTeachers", activeTeachers[0]);
                    activeTeachers[1] = activeTeachersFromActivityGroup(activityGroup[1], userGroups);
                    var repeatGroup = repeatUsers(activeTeachers);
                    var repeat = Object.keys(repeatGroup).length;
                    var activated = Object.keys(activeTeachers[0]).length;
                    console.log("activated", activated);
                    console.log("repeat",repeat);
                    var signUpThisWeek = signUps(users, oneWeekBefore, chosenWeek);
                    console.log("SignUpThisWeek", signUpThisWeek);
                    var retained = retainedUsers(repeatGroup, users, 0, fourWeeksBefore);
                    console.log("retained", retained);
                    // var activatedWeek = activatedThisWeek(activeTeachers[0], signUpThisWeek);

                    var activatedList = function(activeTeachers, users){
                        var list = [];
                        for (var teacher in activeTeachers){
                            console.log("teacher", teacher);
                            var matches = users.filter(function(user) {
                                return user.uuid == activeTeachers[teacher].ownerId;
                            });
                            var fmatches = matches.map(function(user) {
                                for (var i in user.profiles) {
                                    var profile = user.profiles[i];
                                    if (profile.appToken === '72064f1f-2cf8-4819-a3d5-1193e52d928c') {
                                        return {email: profile.email || user.email, name: profile.name};
                                    }
                                }
                            });
                            //console.log(fmatches.length);
                            //console.log(matches[0]);
                            list.push(fmatches[0]);
                            // fmatches.forEach(function(match) {
                            //     console.log(match);
                            // });
                            //
                            // for (var user in users){
                            //     if (activeTeachers[teacher].ownerId === users[user].uuid){
                            //         console.log("YES!");
                            //         // var userProfile = users[user].profiles;
                            //         // for (var profile in userProfile){
                            //         //     list.push({email: userProfile[profile].email, name: userProfile[profile].name});
                            //         //
                            //         // }
                            //     }
                            // }
                        }
                        return list;
                    };
                    var schools = activeSchools(users, chosenWeek);
                    console.log("school", Object.keys(schools).length);
                    var emailList = activatedList(activeTeachers[0], users);
                    console.log("activatedList", emailList);
                    var activeList = activatedList(repeatGroup, users);
                    console.log ("active", activeList);
                    var calculatedMetrics = {
                        "signups": signUpThisWeek,
                        "active": repeat,
                        "activated": activated,
                        "retained": retained,
                        "activatedList": emailList,
                        "activeList": activeList
                    };

                    console.log(calculatedMetrics);
                    callback(calculatedMetrics);

                });

        });
    });


};

exports.data = function (req, res){
    generateData(req.body.timestamp,function(result) {
        res.send(result);
    });
};

exports.newMetric = function(req, res){
    res.render('admin/newMetric');
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
