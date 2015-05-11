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

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuizData.name+"'. You won't be able to continue this quiz.",function() {
            $location.path("/app#/");
            QuizData.cancelQuiz(QuizData.currentQuizData.uuid,function() {

            });
        });
    }
}]);
