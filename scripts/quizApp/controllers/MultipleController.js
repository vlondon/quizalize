angular.module('quizApp')
    .controller('MultipleController', function(QuizData, $log,  $routeParams, $location, $scope){

        var React = require('react');
        var QLMultiple = require('quizApp/components/QLMultiple');

        var self = this;
        var startTime = (new Date()).getTime();

        self.id = $routeParams.quizId;
        self.catId = $routeParams.catId;

        self.questionId = parseInt($routeParams.questionId);
        self.showButtons = false;
        $log.debug('On question', self.questionId);


        var renderReactComponent = function(){
            React.render(
                React.createElement(QLMultiple, {
                    currentQuiz: self.currentQuiz,
                    quizData: QuizData.currentQuizResult(),
                    questionData: self.questionData,
                    question: self.question,
                    alternatives: self.alternatives,
                    imageURL: self.imageURL,
                    latexEnabled: self.latexEnabled,
                    imageEnabled: self.imageEnabled,
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
                self.currentQuiz = data;

                self.score = QuizData.currentQuizResult().totalScore;
                self.questionCount = QuizData.currentQuizResult().questionCount;
                QuizData.getQuestion(self.questionId, function(data){
                    console.log('question???', data);
                    self.imageURL = data.imageURL;
                    self.question = data.question;
                    self.questionData = data;
                    self.answer = data.answer;
                    self.latexEnabled = data.latexEnabled;
                    self.imageEnabled = data.imageEnabled;
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
                    console.log('imageUrl', data);
                    addReactComponent();
                });
            //});
        });

        self.select = function(idx){
            QuizData.answerQuestion(self.questionId,
                                    self.alternatives[idx],
                                    self.answer,
                                    self.question,
                                    Math.max(new Date().getTime() - startTime - 2000, 0),
                                    false);
            // $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
            renderReactComponent();
        };

        self.nextQuestion = function(){
            $location.path(QuizData.generateNextQuestionUrl(self.questionId));
        };

        $log.debug('Multiple Controller', self);
    });
