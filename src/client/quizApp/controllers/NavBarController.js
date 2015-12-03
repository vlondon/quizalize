angular.module('quizApp').controller('NavBarController', function(QuizData,$log, $timeout,$location){
    var self = this;
    var Howl = require('howler').Howl;

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
        return sessionStorage.getItem("mute") === "true" || self.playSoundMode === false;
    };

    self.hideUnmute = function() {
        return sessionStorage.getItem("mute") === "false" || self.playSoundMode === false;
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

    self.playSoundMode = false;
    if (QuizData.currentQuiz() && QuizData.currentQuiz().meta && QuizData.currentQuiz().meta.playSounds === "1" || sessionStorage.getItem("mode") === "preview" || sessionStorage.getItem("mode") === "teacher") {
        self.playSoundMode = true;
    }
    else {
        self.mute();
    }
    if (!sessionStorage.getItem("mute")) {
        if (self.playSoundMode && sessionStorage.getItem("mute") === "true") {
            sessionStorage.setItem("mute", "true");
        }
        else {
            sessionStorage.setItem("mute", "false");
        }
    }
});
