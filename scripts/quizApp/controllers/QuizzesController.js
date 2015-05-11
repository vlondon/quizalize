angular.module('quizApp').controller('QuizzesController', ['QuizData', '$log', '$location', '$timeout', '$scope', function(QuizData, $log, $location, $timeout,$scope){
    var self = this;

    self.loading = true;
    self.orderIndex = "category.name";
    self.user = QuizData.getUser();
    self.name = QuizData.getUsername();
    self.hasQuizzes = false;

    self.startQuiz = function(categoryId,quizId){
        $location.path("/quiz/"+categoryId+"/"+quizId);
    };

    var loadQuizzes = function() {
        QuizData.loadPlayerQuizzes(function(err, res){
            if(!err){
                $scope.$apply(function(){ 
                    self.categories = QuizData.getCategories(); 
                    for (var i in self.categories) {                    
                       self.hasQuizzes = true;
                    }
                    self.loading = false;
                });                                
            }else{
                $log.error("Unable to refresh quizzes", err);
            }
       });        
    }

    self.reloadQuizzes = function(){
        $log.debug("Reloading Quizzes");
        self.loading = true;

        $timeout(function(){
            self.reloadActive = true;
        }, 2000); 
        loadQuizzes();       
    };

    self.logout = function(){
        QuizData.unsetUser();
        $location.path("/");
    };

    if (QuizData.isLoggedIn()) {
        loadQuizzes();
    }
    else {
        $location.path("/");    
    }
}]);
