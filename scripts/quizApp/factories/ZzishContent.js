var settings = require('quizApp/config/settings');

var maxScore = settings.maxScore;
var maxTime = settings.maxTime;
var minScore = settings.minScore;
var gracePeriod = settings.gracePeriod;

angular.module('quizApp')
.factory('ZzishContent', ['$http', '$log', '$rootScope', function($http, $log, $rootScope){
    //Requires zzish.js to have been included
    if(typeof zzish == 'undefined') $log.error("Require zzish.js to use ZzishContent");

    var userId, code, currentActivityId,studentCode;

    return {
        init: function(appId){
            zzish.init(appId);
        },
        user: function(id,name, code, callback){
            zzish.authUser(id, name, code, function(err, message){
                callback(err, message);
            });
        },
        validate: function(classCode){
            self.code = classCode.toLowerCase();
            return zzish.validateClassCode(classCode);
        },
        getPublicQuizzes: function(callback){
            if (self.userId==undefined || self.userId=="") {
                self.studentCode = localStorage.getItem("zname");
                self.userId = localStorage.getItem("zprofileId"+studentCode);
            }
            if (self.userId==undefined|| self.userId=="") {
                //not a registered user so just create a new account
                self.userId = uuid.v4();
            }
            zzish.listPublicContent(self.userId, function (err, message) {
                callback(err, message);
                $rootScope.$apply();
            });

        },
        register: function(profileId, classCode, callback){
            self.code = classCode.toLowerCase();
            self.userId = profileId;
            zzish.registerWithClass(profileId, classCode, function (err, message) {
                callback(err, message);
                $rootScope.$apply();
            });

        },
        login: function(studentCode, callback){
            if (self.userId==undefined) {
                studentCode = localStorage.getItem("zname");
                self.userId = localStorage.getItem("zprofileId"+studentCode);
            }
            if (self.code==undefined) {
                self.code = localStorage.getItem("zcode");
            }
            zzish.registerWithClass(self.userId, self.code, function (err, message) {
                callback(err, message);
                $rootScope.$apply();
            });
        },
        logout: function(userProfileId,callback){
            zzish.unauthUser(userProfileId, function (err, message) {
                localStorage.clear();
                self.userId = "";
                callback(err, message);
                $rootScope.$apply();
            });
        },
        getConsumerContent: function(contentId, callback){
            zzish.getConsumerContent(self.userId, contentId, function (err, message) {
                callback(err, message);
                $rootScope.$apply();
            });
        },
        startActivity: function(quiz, callback){
            var parameters = {
                activityDefinition: {
                    type: quiz.uuid,
                    name: quiz.name,
                    score: settings.maxScore * quiz.questions.length,
                    count: quiz.questions.length,
                    duration: ""+ quiz.questions.length * settings.maxTime,
                },
                extensions: {
                    contentId: quiz.uuid,
                    groupCode: self.code
                }
            }
            if (quiz.categoryId) {
                parameters.extensions.categoryId = quiz.categoryId;
            }
            currentActivityId = zzish.startActivityWithObjects(self.userId,parameters, function(err, message){
                $log.debug("Start Activity response... saving id", message);
                callback(err, message);
            });
	   },
        stopActivity: function(callback){
            zzish.stopActivity(currentActivityId, {}, function(err, message){
                if(typeof callback != 'undefined')
                    callback(err, message);
            });
        },
        saveAction: function(question, options){
            var uuid = question.uuid==undefined?question.question:question.uuid;
            var parameters = {
                definition: {
                    type: uuid,
                    name: question.question,
                    score: maxScore,
                    duration: maxTime,
                    response: question.answer
                },
                result: {
                    score: options.score,
                    count: options.attempts,
                    duration: options.duration,
                    response: options.response,
                    correct: options.correct
                },
                extensions: {}
            }
            if (question.topicId) {
                parameters.extensions["categoryId"] = question.topicId;
            }
            zzish.logActionWithObjects(currentActivityId, parameters);
        }
    };
}]);
