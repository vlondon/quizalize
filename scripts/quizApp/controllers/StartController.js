angular.module('quizApp').controller('StartController', ['QuizData', '$log', '$location','$rootScope', function(QuizData, $log, $location,$rootScope){
    var self = this;
    self.loading = false;
    self.errorMessage = "";
    self.studentName = "";
    self.classCode = "";
    self.studentCode = "";

    var reportError = function(issue){
        self.loading = false;
        self.errorMessage = issue;
    };

    self.startClassQuiz = function(){
        $location.path("/class");
    }

    self.startPublicQuiz = function(){
        $location.path("/public");
    }
}]);
