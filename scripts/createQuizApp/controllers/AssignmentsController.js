angular.module('createQuizApp').controller('AssignmentsController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    self.hasPublicAssignedQuizzes = false;
    self.hasOwnQuizzes = false;

    var loadQuizData = function() {
        QuizData.getTopics(function(data){
            self.topics = {};
            for (var i in data) {
                self.topics[data[i].uuid] = data[i];
            }
            QuizData.getQuizzes(function(data){
                self.pastQuizzes = data;
                for (var i in self.pastQuizzes) {
                    if (self.pastQuizzes[i].publicAssigned) self.hasPublicAssignedQuizzes=true;
                    else self.hasOwnQuizzes = true;
                } 
                QuizData.getGroupContents(function(data) {
                    self.groupContents = data;
                    QuizData.getClassList(function(data) {
                        self.classList = data;    
                    });                    
                });
            });            
        });
    }    

    if (QuizData.getUser()) {
        loadQuizData();
    }
    else {
        $location.path("/");
    }

    self.unpublishQuiz = function(quizId,code){
        QuizData.unpublishQuiz(quizId,code,function(err,message) {
            QuizData.getGroupContents(function(data) {
                self.groupContents = data;
            });            
        })
    };

    $log.debug(self);
}]);
