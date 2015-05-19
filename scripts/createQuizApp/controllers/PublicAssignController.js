angular.module('createQuizApp').controller('PublicAssignController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

    self.id = $routeParams.id;

	QuizData.addQuizById(self.id,function(quiz) {
		if (QuizData.getUser()) {
			$location.path("/published/" + quiz.uuid+"/p");		
		}
		else {
			$location.path("/preview/" + quiz.uuid);			
		}		
	})            
}]);
