angular.module('quizApp').controller('PublicController', ['QuizData', '$log', '$location','$rootScope', function(QuizData, $log, $location,$rootScope){
    var self = this;
    QuizData.getPublicQuizzes(function(err, res){
        self.categories = QuizData.getCategories();        
    });
}]);
