angular.module('quizApp').controller('AnswerController', ['QuizData', '$log', '$routeParams', '$location', '$scope', function(QuizData, $log,  $routeParams, $location, $scope){
    var self = this;

    self.catId = $routeParams.catId;
    self.quizId = $routeParams.quizId;
    self.action = $routeParams.action;
    self.questionId = parseInt($routeParams.questionId);

    self.data = QuizData.currentQuizResult();
    self.showButtons = false;

    /* Have this data for previous question
                {id: idx,
                question: questionName,
                response: response,
                answer: answer,
                correct: correct}
     */

    self.last = self.data.report[self.data.report.length-1];

    self.nextQuestion = function(){
        $location.path(QuizData.generateNextQuestionUrl(self.questionId));
    };

    if (self.data.latexEnabled) {
        self.showButtons = false;
        setTimeout(function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#quizQuestion")[0]]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#response")[0]]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#cresponse")[0]]);
            MathJax.Hub.Queue(function () {
                $scope.$apply(function() {
                    self.showButtons = true;
                });
            });
        },200);
    }
    else {
        self.showButtons = true;
    }

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuiz().meta.name+"'. You won't be able to continue this quiz.",function() {
            if (sessionStorage.getItem("mode")=="teacher") {
                window.location.href="/quiz/public";
            }
            else if (sessionStorage.getItem("mode")=="preview") {
                window.close();
            }
            else if (QuizData.getClassCode()){
                $location.path("/list/" + QuizData.gameCode());
            }
            else if (QuizData.getUser()){
                $location.path("/quiz");
            }
            else if (QuizData.gameCode()){
                $location.path("/list/" + QuizData.gameCode());
            }
            else {
                $location.path("/app");
            }
            QuizData.cancelCurrentQuiz(function() {

            });
        });
    };
}]);
