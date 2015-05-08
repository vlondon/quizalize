angular.module('createQuizApp').controller('PublicController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

	self.assignQuiz = function(quiz) {
		QuizData.addQuiz(quiz,function() {
			$location.path("/preview/" + quiz.uuid);	
		})        
	}   

    QuizData.getPublicQuizzes(function (contents) {
    	self.categories = QuizData.getCategories();
    });	
}]);
