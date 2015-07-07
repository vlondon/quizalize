//general zzish config
var zzish               = require("zzishsdk");
var logger              = require('../logger');
var email              = require('../email');

var QUIZ_CONTENT_TYPE = 'quiz';

var approveDocument = function(req, res, doc) {
  var userId = req.params.profileId;
  var quizId = req.params.id;

  zzish.getUser(userId, null, function(err, user) {
    if (!err) {
      if (user.attributes.admin === 'true') {
        zzish.getPublicContent(QUIZ_CONTENT_TYPE, quizId, function(err1, quiz) {
          if (!err1) {
            if (quiz.meta.published === "pending") {
              quiz.meta.published = "published";
              quiz.meta.updated = Date.now();
              zzish.postContent(quiz.meta.profileId, QUIZ_CONTENT_TYPE, quiz.uuid, quiz.meta, quiz.payload, function(err2, resp) {
                if (!err2) {
                  zzish.getUser(quiz.meta.profileId, null, function(err3, quizUser) {
                    var name = quizUser.name ? quizUser.name : 'there';
                    email.sendEmailTemplate('team@quizalize.com', [quizUser.email], 'Your quiz has been approved', doc, {
                      name: name,
                      quiz: quiz.meta.name,
                      profilelink: 'http://www.quizalize.com/quiz/user/' + quizUser.uuid
                    });
                    res.send("Done");
                  });
                }
                else {
                  res.send("Error", err, resp);
                }
              });
            }
            else {
              res.send("Already Published" + quiz.meta.published);
            }
          }
        });
      }
      else {
        logger.trace('admin ', 'not admin');
        res.send("Anauthorized");
      }
    }
  });
};

exports.approve = function(req, res){
  approveDocument(req, res, 'published');
};

exports.approvefirst = function(req, res){
  approveDocument(req, res, 'firstpublished');
};
