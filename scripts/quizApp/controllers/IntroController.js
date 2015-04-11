angular.module('quizApp').controller('IntroController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParmas, $location){
    var self = this;

    self.name = QuizData.currentQuizData.name;

    self.start = function(){
        $location.path("/quiz/" +  QuizData.chooseKind(0) + "/0");
    };
}]);
