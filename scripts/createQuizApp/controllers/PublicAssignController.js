angular.module('createQuizApp').controller('PublicAssignController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

    self.id = $routeParams.id;
    if(self.id==undefined) $location.path("/");

	QuizData.addQuizById(self.id,function(quiz) {
		$location.path("/preview/" + quiz.uuid);	
	})            
}]);
