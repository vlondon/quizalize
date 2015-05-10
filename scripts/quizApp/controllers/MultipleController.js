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

        self.score = QuizData.currentQuizData.totalScore;
        self.questionCount = QuizData.currentQuizData.questionCount;


        var addReactComponent = function(){
            console.log('self, ', self.question, self.alternatives);
            React.render(
                React.createElement(QLMultiple, {
                    question: self.question,
                    alternatives: self.alternatives,
                    onSelect: function(index){
                        $scope.$apply(function(){
                            self.select(index);
                        });
                    }
                }),
                document.getElementById('reactContainer')
            );
            $scope.$on('$destroy', function(){
                React.unmountComponentAtNode(document.getElementById('reactContainer'));
            });
        };



        var getQuestion = function(){

            QuizData.getQuestion(self.questionId, function(data){
                self.question = data.question;
                self.answer = data.answer;
                self.alternatives = QuizData.getAlternatives(self.questionId);

                if (QuizData.currentQuizData.report[self.questionId] !== undefined) {
                    //we already have this question
                    $location.path('/quiz/answer/' + self.questionId);
                }

                self.longMode = false;
                for(var i in self.alternatives){
                    if(self.alternatives[i].length > 10){
                        self.longMode = true;
                    }
                }
                addReactComponent();
            });
        };

        if (self.id && self.catId){
            QuizData.selectQuiz(self.catId, self.id, getQuestion);
        } else {
            getQuestion();
        }

        self.select = function(idx){
            QuizData.answerQuestion(self.questionId,
                                    self.alternatives[idx],
                                    self.answer,
                                    self.question,
                                    (new Date()).getTime() - startTime);
        };

        $log.debug('Multiple Controller', self);
    }]);
