angular.module('quizApp').controller('QuizzesController', ['QuizData', '$log', '$location', '$timeout', function(QuizData, $log, $location, $timeout){
    var self = this;

    self.loading = true;
    self.orderIndex = "category.name";

    self.startQuiz = function(categoryId,quizId){
        $location.path("/quiz/"+categoryId+"/"+quizId);
    };

    self.reloadQuizzes = function(){
        $log.debug("Reloading Quizzes");
        self.loading = true;

        $timeout(function(){
            self.reloadActive = true;
        }, 2000);

        QuizData.login(null,function(err, res){
            if(!err){
                self.quizzes = QuizData.getQuizzes();
                self.categories = QuizData.getCategories();
                self.loading = false;
            }else{
                $log.error("Unable to refresh quizzes", err);
            }
       });
    };

    self.logout = function(){
        QuizData.logout();
    };

    self.studentData = QuizData.getStudentData();
    if (self.studentData.classCode==undefined) {
        self.categories = QuizData.getCategories();
    }
    else {
        QuizData.login(null,function(err, res){
            if(!err){
                self.quizzes = QuizData.getQuizzes();
                self.categories = QuizData.getCategories();
                self.loading = false;
            }else{
                $log.error("Unable to refresh quizzes", err);
            }
       });
    }
}]);
