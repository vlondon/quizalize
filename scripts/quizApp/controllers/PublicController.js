angular.module('quizApp').controller('PublicController', ['QuizData', '$log', '$location','$rootScope', '$scope',function(QuizData, $log, $location,$rootScope,$scope){
    var self = this;
    self.hasQuizzes = false;

    QuizData.loadPublicQuizzes(function(err, res){
    	$scope.$apply(function(){ 
        	self.categories = QuizData.getCategories();        
        	for (var i in self.categories) {
        		self.hasQuizzes = true;
        	}
        });
    });
}]);
