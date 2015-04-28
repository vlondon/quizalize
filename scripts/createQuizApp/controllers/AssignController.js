angular.module('createQuizApp').controller('AssignController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

    self.id = $routeParams.id;
    if(self.id==undefined) $location.path("/");

	QuizData.getPublicQuizzes(function(result) {
		var quiz = undefined;
		for (var i in result) {
			if (result[i].uuid=self.id) {
				quiz = result[i];
			}
		}
		if (quiz!=null) {
	        QuizData.addQuiz(quiz, function(idx) {
	            $location.path("/preview/" + idx);
	        });			
		}
    });
}]);
