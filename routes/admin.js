//general zzish config
var zzish               = require("zzishsdk");
var logger              = require('../logger');
var email              = require('../email');
var db              = require('./db');
var APP_CONTENT_TYPE    = "app";
var async = require('async');
var QUIZ_CONTENT_TYPE   = "quiz";


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
    db.findDocuments("subject",{}, -1, function(err, subjects) {
        db.findDocuments("contentcategory",{}, -1, function(err, categories) {
            db.findDocuments("content", {"meta.published": "pending"}, -1, function(err, pending) {
                if (!err) {
                    res.render("admin/pending", {pending: pending, categories: categories, subjects: subjects});
                }
                else {
                    res.render("admin/error", {error: err});
                }

            });

        });
    });

};

exports.approved = function(req, res){
    db.findDocuments("content", {"meta.published": "published"}, -1, function(err, result) {
        if (!err) {
            res.render("admin/approved", {approved: result});
        }
        else {
            res.render("admin/error", {error: err});
        }
    });
};

exports.approve = function(req, res){
  approveDocument(req, res, 'published');
};

exports.approvefirst = function(req, res){
  approveDocument(req, res, 'firstpublished');
};
