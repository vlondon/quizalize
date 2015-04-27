angular.module('createQuizApp').controller('PublicController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

	self.assignQuiz = function(quiz) {
        QuizData.addQuiz(quiz, function(idx) {
        	var message = "You Quiz has been added.";
        	if (localStorage.getItem('classCode')==null) {
        		message = "You will now be asked to register so we can store your progress data";
        	}
			QuizData.showMessage("Quiz Added",message,function() {
				$location.path("/preview/" + idx);
				//$location.path("/quiz#/");
			});
        });
	}   

    QuizData.getPublicQuizzes(function (contents) {
    	self.categories = QuizData.getCategories();
    });	
}]);
