angular.module('quizApp').controller('IntroController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParmas, $location){
    var self = this;

    self.name = QuizData.currentQuizData.name;

    self.start = function(){
        $location.path("/quiz/" +  QuizData.chooseKind(0) + "/0");
    };

    self.cancel = function() {
    	QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel this quiz?",function() {
            QuizData.cancelQuiz(QuizData.currentQuizData,function() {
                $location.path("/app#/");
            });
        });
    }
}]);
