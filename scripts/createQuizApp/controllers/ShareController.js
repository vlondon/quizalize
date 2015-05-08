angular.module('createQuizApp').controller('ShareController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;
    self.quiz = undefined;

    self.code = $routeParams.code;
    if (self.code==undefined) $location.path("/");

    QuizData.getQuizByCode(self.code,function(result) {
    	self.quiz = result;
    })

    self.assignQuiz = function(quiz) {
    		
    }
}]);
