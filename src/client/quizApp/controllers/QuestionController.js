angular.module('quizApp')
    .controller('QuestionController', function(QuizData, $log,  $routeParams, $location, $scope, $route){

        var React = require('react');
        var QLVideoPlayer = require('quizApp/components/QLVideoPlayer');

        var self = this;
        var startTime = (new Date()).getTime();

        self.id = $routeParams.quizId;
        self.catId = $routeParams.catId;
        self.questionId = parseInt($routeParams.questionId);
        $log.debug('On question', self.questionId);


        var renderReactComponent = function(){
            React.render(
                React.createElement(QLVideoPlayer, {
                    currentQuiz: self.currentQuiz,
                    quizData: QuizData.currentQuizResult(),
                    questionData: self.questionData,
                    startTime: QuizData.logQuestion(self.questionData),
                    onSelect: function(index){
                        $scope.$apply(() => self.select(index) );
                    },
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
                    console.log('question???', data);
                    self.questionData = data;
                    if (!QuizData.canShowQuestion(self.questionId)) {
                        console.log('question answered', data);
                        //we already have this question
                        $location.path('/quiz/' + self.catId + '/' + self.id + "/answer/" + self.questionId);
                    }
                    else {
                        addReactComponent();
                    }
                });
            //});
        });

        self.select = function(userAnswer){
            QuizData.answerQuestion(self.questionId,
                                    self.questionData,
                                    userAnswer,
                                    Math.max(new Date().getTime() - startTime - 2000, 0));
            renderReactComponent();
        };

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

        $log.debug('Question Controller', self);
    });
