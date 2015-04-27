angular.module('quizApp').controller('GameController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', function(QuizData, $log, $location,$rootScope,$routeParams){
    var self = this;

    self.id = $routeParams.id;
    self.catId = $routeParams.catId;
    if(self.catId==undefined) $location.path("/public");
    if(self.id==undefined) $location.path("/public");

    QuizData.selectQuiz(self.catId,self.id,function() {
        $location.path("/quiz/intro")
    });        
}]);
