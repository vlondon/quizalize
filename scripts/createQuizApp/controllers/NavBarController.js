angular.module('createQuizApp').controller('NavBarController', ['QuizData','$log', '$timeout', '$location', function(QuizData,$log, $timeout,$location){
    var self = this;
    self.showHelp = false;
    $("#assignments").hide();            
    $("#quizzes").hide();            
    if (QuizData.getUser()) {
        $("#LoginButton").html("Logout");        
        QuizData.getGroupContents(function(data) {
            var hasData = false;
            for (var i in data) {
                hasData = true;
                break;
            }
            if (hasData) {
                $("#assignments").show();            
            }            
            QuizData.getQuizzes(function(data) {
                var hasData = false;
                for (var i in data) {
                    hasData = true;
                    break;
                }
                if (hasData) {
                    $("#quizzes").show();
                }
            })
        })
    }

    self.dismiss = function(){
        self.showHelp = !self.showHelp;
        if (self.showHelp) {
        	$("#intro").show();
        }
    }

    self.hasQuiz = function() {
    	return localStorage.getItem("quizData")!=null;
    }

    self.confirmed = function() {
        QuizData.confirmed($("#modalUuid").val());
    }

    self.login = function() {
        if (QuizData.unsetUser()) {
            //need to logout
            //logout();
            $location.path("/quiz#/");
        }
        else {
            $location.path("/login");    
        }
    }
}]);
