angular.module('quizApp').controller('QuizzesController', ['QuizData', '$log', '$location', '$timeout', function(QuizData, $log, $location, $timeout){
    var self = this;

    self.loading = true;
    self.orderIndex = "category.name";

    self.startQuiz = function(categoryId,quizId){
        $location.path("/quiz/"+categoryId+"/"+quizId);
    };

    var loadQuizzes = function() {
        QuizData.loadPlayerQuizzes(function(err, res){
            if(!err){
                self.categories = QuizData.getCategories();
                self.loading = false;
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
    };

    if (QuizData.getUser() && QuizData.getClass()) {
        loadQuizzes();
    }
}]);
