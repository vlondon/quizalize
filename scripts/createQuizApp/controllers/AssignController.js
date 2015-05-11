angular.module('createQuizApp').controller('AssignController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

    self.id = $routeParams.id;
    if(self.id==undefined) $location.path("/");

	if (QuizData.getUser()) {
		$location.path("/published/" + self.id +"/p");	
	}
	else {
		$location.path("/preview/" + self.id);	
	}        
}]);
