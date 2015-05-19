angular.module('quizApp').controller('AnswerController', ['QuizData', '$log', '$routeParams', '$location', '$scope', function(QuizData, $log,  $routeParams, $location, $scope){
    var self = this;

    self.catId = $routeParams.catId;
    self.quizId = $routeParams.quizId;
    self.action = $routeParams.action;
    self.questionId = parseInt($routeParams.questionId);

    self.data = QuizData.currentQuizResult();

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
    }

    if (self.data.latexEnabled) {
        $("#quizQuestion").hide();
        $("#response").hide();
        $("#cresponse").hide();
        setTimeout(function() {
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#quizQuestion")[0]]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#response")[0]]);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#cresponse")[0]]);
        },200);     
        setTimeout(function() {
            $("#quizQuestion").show();
            $("#response").show();
            $("#cresponse").show();
        },1000);     
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
            QuizData.cancelCurrentQuiz(function() {

            });
        });
    }
}]);
