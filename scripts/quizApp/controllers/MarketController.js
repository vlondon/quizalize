angular.module('quizApp').controller('MarketController', ['QuizData', '$log', '$location','$rootScope', '$scope','$routeParams', function(QuizData, $log, $location,$rootScope,$scope,$routeParams){
    var self = this;
    self.id = $routeParams.id;
    self.hasQuizzes = false;

    QuizData.loadGroupContent(self.id,function(err, res){
    	$scope.$apply(function(){ 
        	self.categories = QuizData.getCategories();        
        	self.group = res.group;
        	for (var i in self.categories) {
        		self.hasQuizzes = true;
        	}
        });
    });

    self.playQuiz = function(quiz) {
        sessionStorage.setItem("mode","teacher");
        if (QuizData.getUser()) {
            $location.path("#/app#/play/public/"+quiz.uuid+"/true");
            
        }    
        else {
            window.location.href="/quiz#/playh/preview/"+quiz.uuid;          
        }        
    }

    self.assignQuiz = function(quiz) {
      window.location.href="/quiz#/passign/"+quiz.uuid;
    }
}]);
