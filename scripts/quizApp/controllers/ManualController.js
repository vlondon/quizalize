angular.module('quizApp').controller('ManualController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParmas, $location){
    var self = this;
    var startTime = (new Date()).getTime();

    self.questionId = parseInt($routeParmas.questionId);
    $log.debug("On question", self.questionId, "with quiz data", QuizData.currentQuizData);

    self.score = QuizData.currentQuizData.totalScore;
    self.questionCount = QuizData.currentQuizData.questionCount;

    self.yourAnswer = "";

    QuizData.getQuestion(self.questionId, function(data){
        self.question = data.question;
        self.answer = data.answer;
    });

    self.manualAnswer = function(){
        QuizData.answerQuestion(self.questionId, self.yourAnswer, self.answer, self.question,
                                (new Date()).getTime() - startTime);
    };

    $log.debug("Manual Controller", self);
}]);
