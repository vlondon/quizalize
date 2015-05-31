angular.module('quizApp').controller('PublicController', function(QuizData, $log){
	var self = this;
	self.hasQuizzes = false;

	QuizData.loadPublicQuizzes(function(){
		self.categories = QuizData.getCategories();
        console.log('self', self);
		for (var i in self.categories) {
			self.hasQuizzes = true;
		}
	});
});
