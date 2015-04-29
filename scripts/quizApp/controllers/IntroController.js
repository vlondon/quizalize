angular.module('quizApp').controller('IntroController', ['QuizData', '$log', '$routeParams', '$location','$scope', function(QuizData, $log,  $routeParmas, $location,$scope){
    var self = this;

    self.name = QuizData.currentQuizData.name;

    self.start = function(){
        $location.path("/quiz/" +  QuizData.chooseKind(0) + "/0");
    };

    self.return = function() {
        $location.path("/app/");
    }

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuizData.name+"'. You won't be able to continue this quiz.",function() {
            $location.path("/app#/"); 
            QuizData.cancelQuiz(QuizData.currentQuizData.uuid,function() {
                
            });
        });
    };        
}]);
