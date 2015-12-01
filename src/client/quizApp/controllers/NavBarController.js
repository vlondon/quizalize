angular.module('quizApp').controller('NavBarController', function(QuizData,$log, $timeout,$location){
    var self = this;
    var Howl = require('howler').Howl;

    if (!sessionStorage.getItem("mute")) {
        sessionStorage.setItem("mute", "false");
    }

    self.confirmed = function() {
        QuizData.confirmed($("#modalUuid").val());
    };

    self.logout = function() {
    	QuizData.unsetUser();
    	$location.path("/");
    };

    self.loadApp = function() {
        $location.path("/app");
    };

    self.hideCancel = function() {
        return sessionStorage.getItem("mode")=="demo";
    };

    self.hideMute = function() {
        return sessionStorage.getItem("mute") === "true";
    };

    self.hideUnmute = function() {
        return sessionStorage.getItem("mute") === "false";
    };

    self.loggedIn = QuizData.getUser();

    var processCancel = function() {
        if (sessionStorage.getItem("mode")=="teacher") {
            window.location.href="/quiz/public";
        }
        else if (sessionStorage.getItem("mode")=="preview") {
            window.close();
        }
        else if (QuizData.getClassCode()){
            $location.path("/list/" + QuizData.gameCode());
        }
        else if (QuizData.getUser()){
            $location.path("/quiz");
        }
        else if (QuizData.gameCode()){
            $location.path("/list/" + QuizData.gameCode());
        }
        else {
            $location.path("/");
        }
        QuizData.cancelCurrentQuiz(function() {

        });
    };

    self.cancel = function() {
        if (QuizData.currentQuiz()) {
            QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuiz().meta.name+"'. You won't be able to continue this quiz.",function() {
                processCancel();
            });
        }
        else {
            processCancel();
        }
    };

    self.mute = function() {
        Howler.mute();
        sessionStorage.setItem("mute", "true");
    };

    self.unmute = function() {
        Howler.unmute();
        sessionStorage.setItem("mute", "false");
    };

});
