angular.module('quizApp').controller('AnswerController', ['QuizData', '$log', '$routeParams', '$location', '$scope', function(QuizData, $log,  $routeParams, $location, $scope){
    var self = this;
    var React = require('react');
    var QLAnswer = require('quizApp/components/QLAnswerScreen');
    self.catId = $routeParams.catId;
    self.quizId = $routeParams.quizId;
    self.id = $routeParams.quizId;
    self.questionId = parseInt($routeParams.questionId);

    /* Have this data for previous question
                {id: idx,
                question: questionName,
                response: response,
                answer: answer,
                correct: correct}
     */


     var renderReactComponent = function(){
         React.render(
             React.createElement(QLAnswer, {
                 currentQuiz: self.currentQuiz,
                 questionData: self.questionData,
                 answerData: self.currentAnswer,
                 onNext: function(){
                     $scope.$apply(()=> self.nextQuestion() );
                 }
             }),
             document.getElementById('reactContainer')
         );
     };


     var addReactComponent = function(){
         setTimeout(renderReactComponent, 200);

         $scope.$on('$destroy', function(){
             React.unmountComponentAtNode(document.getElementById('reactContainer'));
         });

     };

     QuizData.loadQuiz(self.catId, self.id, function(data) {
         //$scope.$apply(function(){
             // var extraQuizData = ExtraData.videoQuizHandler(data);
             // self.currentQuiz = extraQuizData.quiz;
             // self.videoQuizData = extraQuizData.extra;
             self.currentQuiz = data;
             self.quiz = QuizData.currentQuizResult();
             QuizData.getQuestion(self.questionId, function(data){
                 self.questionData = data;
                 var currentAnswerFilter = self.quiz.report.filter(function(f) {
                     return f.questionId == data.uuid;
                 });
                 if (currentAnswerFilter.length > 0) {
                     self.currentAnswer = currentAnswerFilter[0];
                     addReactComponent();
                 }
                 else {
                     $location.path(QuizData.generateNextQuestionUrl(self.questionId));
                 }
             });
         //});
     });


    self.nextQuestion = function(){
        var nextUrl = QuizData.generateNextQuestionUrl(self.questionId);
        if (nextUrl) {
            if (nextUrl === $location.url()) {
                $route.reload();
            }
            else {
                $location.path(QuizData.generateNextQuestionUrl(self.questionId));
            }
        }
    };

    $log.debug('Answer Controller', self);
}]);
