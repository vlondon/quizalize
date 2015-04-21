angular.module('createQuizApp').controller('DeleteController', ['QuizData', '$log', '$location', '$routeParams', function(QuizData, $log, $location, $routeParams){
    self.id = parseInt($routeParams.id);
    if(isNaN(self.id)) $location.path("/");
    QuizData.deleteQuiz(self.id, function() {
        $log.debug("going to /");
        $location.path("/");
    });
}]);
