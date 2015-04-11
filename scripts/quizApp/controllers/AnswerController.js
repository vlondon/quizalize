angular.module('quizApp').controller('AnswerController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParmas, $location){
    var self = this;

    self.questionId = parseInt($routeParmas.questionId);

    self.data = QuizData.currentQuizData;
    self.studentData = QuizData.getStudentData();

    /* Have this data for previous question
                {id: idx,
                question: questionName,
                response: response,
                answer: answer,
                correct: correct}
     */

    self.last = self.data.report[self.data.report.length-1];

    self.nextQuestion = function(){
        var q = self.questionId + 1;
        $location.path("/quiz/" +  QuizData.chooseKind(q) + "/" + (q));
    }
}]);
