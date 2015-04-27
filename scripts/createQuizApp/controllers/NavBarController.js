angular.module('createQuizApp').controller('NavBarController', ['QuizData','$log', '$timeout', function(QuizData,$log, $timeout){
    var self = this;
    self.showHelp = false;
    self.classCode = localStorage.getItem("classCode");

    self.dismiss = function(){
        self.showHelp = !self.showHelp;
        if (self.showHelp) {
        	$("#intro").show();
        }
        localStorage.setItem("showHelp", self.showHelp);
    }

    self.hasQuiz = function() {
    	return localStorage.getItem("quizData")!=null;
    }

    self.confirmed = function() {
        QuizData.confirmed($("#modalUuid").val());
    }
}]);
