angular.module('createQuizApp').controller('DeleteController', ['QuizData', '$log', '$location', '$routeParams', function(QuizData, $log, $location, $routeParams){
    self.id = $routeParams.id;
    if(self.id==undefined) $location.path("/");
    QuizData.deleteQuiz(self.id, function() {
        $location.path("/quizzes");
    });
}]);
