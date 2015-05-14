
angular.module('quizApp')
    .controller('MultipleController', ['QuizData', '$log', '$routeParams', '$location', '$scope', function(QuizData, $log,  $routeParams, $location, $scope){

        var React = require('react');
        var QLMultiple = require('quizApp/components/QLMultiple');


        var self = this;
        var startTime = (new Date()).getTime();

        self.id = $routeParams.quizId;
        self.catId = $routeParams.catId;

        self.questionId = parseInt($routeParams.questionId);
        $log.debug('On question', self.questionId);


        var renderReactComponent = function(){
            React.render(
                React.createElement(QLMultiple, {
                    quizData: QuizData.currentQuizResult(),
                    question: self.question,
                    alternatives: self.alternatives,
                    onSelect: function(index){
                        $scope.$apply(function(){
                            self.select(index);
                        });
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
                self.currentQuiz = data;
                self.score = QuizData.currentQuizResult().totalScore;
                self.questionCount = QuizData.currentQuizResult().questionCount;
                QuizData.getQuestion(self.questionId, function(data){

                    self.question = data.question;
                    self.answer = data.answer;
                    self.alternatives = QuizData.getAlternatives(self.questionId);

                    if (QuizData.currentQuizResult().report[self.questionId] !== undefined) {
                        //we already have this question
                        $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
                    }

                    self.longMode = false;
                    for(var i in self.alternatives){
                        if(self.alternatives[i].length > 10){
                            self.longMode = true;
                        }
                    }
                    // addReactComponent();
                });
            //});
        });

        self.select = function(idx){
            QuizData.answerQuestion(self.questionId,
                                    self.alternatives[idx],
                                    self.answer,
                                    self.question,
                                    (new Date()).getTime() - startTime,
                                    true);
            $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
            renderReactComponent();
        };

        self.nextQuestion = function(){
            $location.path(QuizData.generateNextQuestionUrl(self.questionId));
        };

        $log.debug('Multiple Controller', self);
    }]);
