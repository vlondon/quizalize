angular.module('createQuizApp').controller('PublicController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;
    self.hasQuizzes = false;

	self.assignQuiz = function(quiz) {
		QuizData.addQuiz(quiz,function() {
			$location.path("/preview/" + quiz.uuid);
		});
	};

	self.previewQuiz = function(quiz) {
	    if (QuizData.getUser()) {
	        window.location.href="/app#/play/public/"+quiz.uuid+"/true";
	    }
		else {
			$location.path("/playh/preview/" + quiz.uuid);
		}
	}

    QuizData.getPublicQuizzes(function (contents) {
    	self.categories = QuizData.getCategories();
    	for (var i in self.categories) {
    		self.hasQuizzes = true;
    	}
    });
}]);
