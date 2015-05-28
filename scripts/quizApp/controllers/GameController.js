angular.module('quizApp').controller('GameController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', '$scope',function(QuizData, $log, $location,$rootScope,$routeParams,$scope){
    var self = this;

    self.id = $routeParams.id;
    self.action = $routeParams.action;
    self.catId = $routeParams.catId;
    self.numQuestions = "the";
    self.randomText = ".";
    self.showSubText = false;

    QuizData.selectQuiz(self.catId,self.id,self.action=="false",function(err,result) {
        if (!err) {
            self.currentQuiz = result;
            if (self.currentQuiz.settings) {
                if (self.currentQuiz.settings['random']) {
                    self.randomText = " in random order.";
                    self.showSubText = true;
                }
                if (self.currentQuiz.settings['numQuestions']) {
                    self.numQuestions = self.currentQuiz.questions.length;
                    try {
                        self.numQuestions = Math.min(parseInt(self.currentQuiz.settings['numQuestions']),self.currentQuiz.questions.length);
                    }
                    catch (e) {

                    }
                    self.showSubText = true;
                }
            }
        }
    });

    self.start = function(){
        var url = "/quiz/" + self.catId + '/' + self.id + "/" + QuizData.selectQuestionType(0) + "/0";
        QuizData.startCurrentQuiz();
        $location.path(url);
    };

    self.return = function() {
        if (sessionStorage.getItem("mode")=="preview") {
            window.close();
        }
        else {
            $location.path("/app/");
        }
    }

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuiz().name+"'. You won't be able to continue this quiz.",function() {
            if (sessionStorage.getItem("mode")=="teacher") {
                window.location.href="/quiz#/public";
            }
            else if (sessionStorage.getItem("mode")=="preview") {
                window.close();
            }
            else {
                $location.path("/list");
            }
        });
    };

}]);
