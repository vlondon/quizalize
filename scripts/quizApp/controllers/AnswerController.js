angular.module('quizApp').controller('AnswerController', ['QuizData', '$log', '$routeParams', '$location', '$scope', function(QuizData, $log,  $routeParmas, $location,$scope){
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

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz","Are you sure you want to cancel '" + QuizData.currentQuizData.name+"'. You won't be able to continue this quiz.",function() {
            $location.path("/app#/"); 
            QuizData.cancelQuiz(QuizData.currentQuizData.uuid,function() {
                
            });
        });
    }        
}]);
