angular.module('quizApp').controller('GameController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', function(QuizData, $log, $location,$rootScope,$routeParams){
    var self = this;

    self.id = $routeParams.id;
    self.catId = $routeParams.catId;
    if(self.catId==undefined) $location.path("/public");
    if(self.id==undefined) $location.path("/public");

    if (self.catId=="A") {
    	sessionStorage.setItem("teacher",true);
        var hasTopics = false;
        for (i in QuizData.getTopics()) {
            hasTopics = true;
        }
        if (!hasTopics) {
            QuizData.getPublicQuizzes(function(result) {
                QuizData.selectQuiz(self.catId,self.id,function() {
                    self.name = QuizData.currentQuizData.name;
                });
            });
        }
        else {
        QuizData.selectQuiz(self.catId,self.id,function() {
            self.name = QuizData.currentQuizData.name;
        });
        }
    }
    else {
        QuizData.selectQuiz(self.catId,self.id,function() {
            self.name = QuizData.currentQuizData.name;
        });
    }

    self.start = function(){
        var url = "/quiz/" + self.catId + '/' + self.id + '/' +  QuizData.chooseKind(0) + "/0";
        $location.path(url);
    };

    self.return = function() {
        $location.path("/app/");
    }

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuizData.name+"'. You won't be able to continue this quiz.",function() {
            $location.path("/app#/");
            QuizData.cancelQuiz(QuizData.currentQuizData.uuid,function() {

            });
        });
    };

}]);
