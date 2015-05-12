angular.module('quizApp').controller('GameController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', '$scope',function(QuizData, $log, $location,$rootScope,$routeParams,$scope){
    var self = this;

    self.id = $routeParams.id;
    self.action = $routeParams.action;
    self.catId = $routeParams.catId;

    QuizData.selectQuiz(self.catId,self.id,self.action=="false",function(err,result) {
        if (!err) {
            $scope.$apply(function(){ 
               self.currentQuiz = result; 
            });            
        }
    });

    self.start = function(){
        var url = "/quiz/" + self.catId + '/' + self.id + "/" + QuizData.selectQuestionType(0) + "/0";
        QuizData.startCurrentQuiz();
        $location.path(url);
    };

    self.return = function() {
        $location.path("/app/");
    }

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuiz.name+"'. You won't be able to continue this quiz.",function() {
            $location.path("/app#/");            
        });
    };

}]);
