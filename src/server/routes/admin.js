//general zzish config
var async = require('async');
var XLSX = require('xlsx');
var fs = require('fs');
var zzish = require('zzishsdk');

var config = require("../config"); //initialized zzish
var email     = require('../email');
var db = require('./db');
var generateData = require ('./generateData');
// var calculateActives = require ('./calculateActives');
var GoogleAnalytics = require('ga');


var host = 'www.quizalize.com';
var ua = process.env.QUIZALIZEGA;
var ga = new GoogleAnalytics(ua, host);
var APP_CONTENT_TYPE    = "app";
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
exports.quizlist = function(req, res){
    console.log("Querying DB");
    zzish_db.secure.post("db/content/query/", {"query": "{'meta.originalQuizId':{$exists:false}, 'type': 'quiz', 'meta.published': {$exists: false}}", "project":"{'updated':1, 'type':1, 'meta': 1, 'uuid': 1, 'name':1, 'payload':1, 'created':1}"}, function(err, quizzes) {
        console.log("Fetching quizzes");
        res.render("admin/quizlist", { quizzes: JSON.parse(quizzes.payload)});
    });
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
    // res.render("admin/pending");
    // console.log("Building page", zzish_db);
    // zzish_db.secure.post("db/contentcategory/query/",{"query": "{}"}, function(err, categories){
    //     console.log("Fetching Categories");
    //     //console.log(categories.length.payload);
    //     zzish_db.secure.post("db/subject/query/",{"query": "{}"}, function(err, subjects){
    //         zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'pending'}"}, function(err, pending) {
    //             res.render("admin/pending", {
    //                 pending: JSON.parse(pending.payload),
    //                 categories: JSON.parse(categories.payload),
    //                 subjects: JSON.parse(subjects.payload),
    //                 pendingString: pending.payload
    //             });
    //         });
    //     });
    // });
    zzish_db.secure.post("db/content/query/", {"query": "{'meta.published': 'pending'}"}, function(err, pending) {
        res.render("admin/pending", {
            pending: JSON.parse(pending.payload)
        });
    });
};

exports.queryDb = function(req, res) {
    console.log("Building page", zzish_db);
    zzish_db.secure.post("db/" + req.body.dbname + "/query/",{"query": req.body.dbquery}, function(err, result){
        res.send(JSON.parse(result.payload));
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
    }, function() {
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

exports.logInAsUser = function(req, res) {
    let {profileId} = req.params;
    zzish.user(profileId, function(err, data){
        if (!err && typeof data === 'object') {
            console.log('we got user', data);
            var uuid = data.uuid;
            req.session.userUUID = uuid;
            req.session.user = data;
            res.status(200);
        }
        else {
            req.session.userUUID = undefined;
            res.status(err);
        }
        res.send(data);
    });
};

exports.loginAsUserAndSetAccountType = function(req, res) {
    let {profileId, accountType} = req.params;
    zzish.user(profileId, function(err, user){
        if (!err && typeof user === 'object') {

            var uuid = user.uuid;

            user.attributes.accountType = accountType;
            user.attributes.accountTypeUpdated = Date.now();
            // We unset the accountTypeExpiration
            // delete user.attributes.accountTypeExpiration;
            user.attributes.accountTypeExpiration = undefined;

            zzish.saveUser(profileId, user, function(err, newUser){
                if (!err && typeof data === 'object') {
                    res.status(200);
                    user = newUser;
                }
                else {
                    res.status(400);
                }
                res.send(user);
            });


            req.session.userUUID = uuid;
            req.session.user = user;
            res.status(200);
        }
        else {
            req.session.userUUID = undefined;
            res.status(err);
        }

    });
};
