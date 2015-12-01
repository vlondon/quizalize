var config = require("../config"); //initialized zzish
var email              = require('../email');
var APP_CONTENT_TYPE    = "app";
var async = require('async');
var db = require('./db');
var async = require("async");
var XLSX = require('xlsx');
var fs = require('fs');
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

var generateData = function(chosenWeek, callback) {
    var activityQuery = {"query":"{'ownerId': '72064f1f-2cf8-4819-a3d5-1193e52d928c', 'contentId': {$exists: true}, 'status': 'ACTIVITY_INSTANCE_COMPLETED'}",
    "project":"{'timestamp': 1, 'contentId': 1, 'groupId': 1, 'profileId': 1}"};
    console.log("Generating data");

    zzish_db.secure.post("db/activityinstance/query/", activityQuery, function(err, activityinstances){
        console.log(err, "Fetching activities");
        zzish_db.secure.post("db/user/query/", {"query": "{'profiles.appToken': '72064f1f-2cf8-4819-a3d5-1193e52d928c', 'profile': {$exists: true}}",
                        "project": "{ 'uuid': 1, 'profiles.email':1, 'created': 1, 'email': 1}",
                        "limit": "100"},
                        function(err, userList){
                console.log("Fetching Users");
                zzish_db.secure.post("db/usergroup/query/", {"query": "{}", "project":"{'uuid': 1, 'ownerId': 1}"}, function(errGroup, usergroup) {
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
                    console.log("users", users.length);
                    var activities = JSON.parse(activityinstances.payload);

                    var oneWeekBefore = chosenWeek - 7 * 24 * 60 * 60 * 1000;
                    var twoWeeksBefore = chosenWeek - 14 * 24 * 60 * 60 * 1000;
                    var fourWeeksBefore = chosenWeek - 28 * 24 * 60 * 60 * 1000;
                    var createDateArray = function(chosenStart){
                            var dateArray = [];
                            var oneWeek = 7 * 24 * 60 * 60 * 1000;
                            var i = 0;
                            while (i < 4){
                                dateArray[i] = chosenStart - i * oneWeek;
                                i++;
                            }
                        return dateArray;
                    };
                    var multipleTeacherArrays = function (chosenWeek, activities, userGroups){
                            var dateArray = createDateArray(chosenWeek);
                            var i = 0;
                            console.log(dateArray.length, "long");
                            var teachArray = [];
                            while (i < dateArray.length){
                                    console.log(i);
                                    var activeGroup = activityGroupFromActivities(activities, dateArray[i+1], dateArray[i]);
                                    console.log(activeGroup);
                                    teachArray[i] = activeTeachersFromActivityGroup(activeGroup, userGroups);
                                    console.log(i, "array", teachArray);
                                    i++;
                            };
                        return teachArray;
                    };
                    var monthlyActives = function (teachArray){
                        var dayActive = {};
                        teachArray.forEach(function(teach){
                            for (var ownerId in teach){
                                if (dayActive[ownerId] === undefined){
                                    dayActive[ownerId] = {ownerId: ownerId, count: 1};
                                }
                                else {
                                    dayActive[ownerId].count++;
                                }
                            }
                        });
                    };
                    var signUps = function(users, periodStart, periodEnd){
                        var count = 0;
                        users.forEach(function(user){
                            if(user.created > periodStart && user.created < periodEnd && user.email !== undefined && user.email.indexOf("+") === -1) {
                                count++;
                            }
                        });
                        return count;
                    };
                    var activeSchools = function (users, periodEnd){
                            var schools = {};
                            var domains = ["gmail", "yahoo", "hotmail", "zzish", "katamail", "live", "chasemail", "purplegator", "leafinvestments", "blaiprat", "test", "aol", "outlook", "libero", "mac", "yardstudio", "itslearning", "touchpress", "msn"];
                            users.forEach(function(user){
                                if(user.email !== undefined && user.created < periodEnd){
                                    var domain = user.email.split("@")[1];
                                    if (domain !== undefined){
                                        domain = domain.toLowerCase();
                                        if (domains.join(",").indexOf(domain.split(".")[0]) === -1){
                                            if (schools[domain] === undefined){
                                                schools[domain] = {domain: domain, count: 1};

                                            }
                                            else {
                                                schools[domain].count++;
                                            }

                                        }
                                    }
                                }
                                // else {
                                //     var profile = user.profiles.filter(function(prof){
                                //         return prof.appToken == '72064f1f-2cf8-4819-a3d5-1193e52d928c';
                                //     });
                                //
                                //     if (profile[0].email !== undefined && user.created < periodEnd){
                                //         var domain = profile[0].email.split("@")[1];
                                //         if (domain !== undefined){
                                //             domain = domain.toLowerCase();
                                //             if (domains.join(",").indexOf(domain.split(".")[0]) === -1){
                                //                 if (schools[domain] === undefined){
                                //                     schools[domain] = {domain: domain, count: 1};
                                //                 }
                                //                 else {
                                //                     schools[domain].count++;
                                //                 }
                                //             }
                                //         }
                                //
                                //
                                //
                                //     }
                                // }
                            });
                            return schools;
                    };

                    var multiSchools = function (schools){
                        var schoolCount = 0;
                        for (var school in schools){
                            if (schools[school].count > 1){
                                schoolCount++;
                            }
                        }
                        return schoolCount;
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
                            if (activityGroup[groupId].count > 2){
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
                            return repeat;

                    };

                    var retainedUsers = function (repeat, users, periodStart, periodEnd){
                        var signUpsMonth = signUpsGroup(users, periodStart, periodEnd);
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

                    var activatedThisWeek = function (activeTeachers, signUps){
                        console.log("signupsinact", signUps);
                        var activatedTeachersArray = [];
                        var count=0;
                        for (var teacher in activeTeachers){
                            for (var signUp in signUps){
                                if (activeTeachers[teacher].ownerId === signUps[signUp].uuid){
                                    console.log("ownerId",activeTeachers[teacher].ownerId);
                                    console.log("uuid",signUps[signUp].uuid);
                                    activatedTeachersArray.push( activeTeachers[teacher].ownerId);
                                    count++;
                                    console.log("activecount",count);
                                }
                            }
                        }
                        console.log("activatedthisweek",activatedTeachersArray);
                        return count;
                    };

                    var activatedList = function(activeTeachers, users){
                        var list = [];
                        for (var teacher in activeTeachers){
                            var matches = users.filter(function(user) {
                                return user.uuid == activeTeachers[teacher].ownerId;
                            });
                            var fmatches = matches.map(function(user) {
                                for (var i in user.profiles) {
                                    var profile = user.profiles[i];
                                        return {email: profile.email || user.email, name: profile.name};

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

                    //Active Classes
                    var activityGroup = [];
                    activityGroup[0] = activityGroupFromActivities(activities, oneWeekBefore, chosenWeek);
                    activityGroup[1] = activityGroupFromActivities(activities, twoWeeksBefore, oneWeekBefore);

                    //Active Teachers
                    var activeTeachers = [];
                    activeTeachers[0] = activeTeachersFromActivityGroup(activityGroup[0], userGroups);
                    activeTeachers[1] = activeTeachersFromActivityGroup(activityGroup[1], userGroups);
                    var repeatGroup = repeatUsers(activeTeachers);
                    var repeat = Object.keys(repeatGroup).length;
                    var activated = Object.keys(activeTeachers[0]).length;
                    var signUpThisWeek = signUps(users, oneWeekBefore, chosenWeek);
                    var signUpWeekBefore = signUps(users, twoWeeksBefore, chosenWeek);
                    var totalSignUps = signUps(users, 0, chosenWeek);
                    var retained = retainedUsers(repeatGroup, users, 0, fourWeeksBefore);
                    var activatedWeek = activatedThisWeek(activeTeachers[0], signUpsGroup(users, twoWeeksBefore, chosenWeek)) +activatedThisWeek(activeTeachers[1], signUpsGroup(users, twoWeeksBefore, chosenWeek));

                    var schools = activeSchools(users, chosenWeek);
                    var schoolsMulti = multiSchools(schools);
                    var emailList = activatedList(activeTeachers[0], users);
                    var activeList = activatedList(repeatGroup, users);
                    var monthlyTeachers = multipleTeacherArrays(chosenWeek, activities, userGroups);
                    console.log(monthlyTeachers);
                    var dayActives = monthlyActives(monthlyTeachers);
                    console.log("day actives", dayActives);

                    var calculatedMetrics = {
                        "signups": signUpThisWeek,
                        "active": repeat,
                        "activated": activated,
                        "retained": retained,
                        "activatedList": emailList,
                        "activeList": activeList,
                        "schools": Object.keys(schools).length,
                        "schoolsMulti": schoolsMulti,
                        "activatedRatio": ((activatedWeek/signUpWeekBefore)*100).toFixed(3),
                        "activatedOverall": ((activated/totalSignUps)*100).toFixed(3)
                    };

                    console.log(calculatedMetrics);
                    callback(calculatedMetrics);

                });

        });
    });


};

module.exports = generateData;
