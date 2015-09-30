var randomise = require('quizApp/utils/randomise');
var React = require('react');
var QLScrambled = require('quizApp/components/QLScrambled');


angular.module('quizApp').controller('ScrambledController', ['QuizData', '$log', '$routeParams', '$location', '$scope','$route',function(QuizData, $log,  $routeParams, $location,$scope, $route){
    var self = this;
    var getLetters = function(answer){

        var letters = answer.toUpperCase().split('');
        // letters.push('C');
        // letters.push('R');
        // letters.push('E');
        return randomise(letters);
    };

    var getUserAnswer = function(n){
        var ans = [];
        for(var i=0; i < n; i++){
            ans.push("AAA");
        }
        return ans;
    };

    var arrayMatch = function(a,b){
        if(a.length != b.length){
            return false;
        }
        for(var i=0; i< a.length; i++){
            if(a[i] != b[i]){
                return false;
            }
        }
        return true;
    };

    var renderReactComponent = function(){
        React.render(
            React.createElement(QLScrambled, {
                quizData: QuizData.currentQuizResult(),
                answer: self.userAnswerLetters,
                question: self.question,
                questionData: self.questionData,
                letters: self.letters,
                imageURL: self.imageURL,
                imageEnabled: self.imageEnabled,
                startTime: QuizData.logQuestion(self.questionData),
                onAddLetter: function(index) {
                    $scope.$apply(function(){
                        self.addLetter(index);
                    });
                },
                onRemoveLetter: function(index) {
                    $scope.$apply(function(){
                        self.removeLetter(index);
                    });
                },
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

    var startTime = (new Date()).getTime();

    self.id = $routeParams.quizId;
    self.catId = $routeParams.catId;
    self.questionId = parseInt($routeParams.questionId);
    self.showButtons = false;
    $log.debug("On question", self.questionId);

    var lastEmpty;

    QuizData.loadQuiz(self.catId, self.id, function(data) {
        //
            self.currentQuiz = data;
            self.score = QuizData.currentQuizResult().totalScore;
            self.questionCount = QuizData.currentQuizResult().questionCount;

            QuizData.getQuestion(self.questionId, function(data){
                self.question = data.question;
                self.questionData = data;
                //self.answer = replaceSpaces(data.answer);
                self.answer = data.answer;
                self.imageURL = data.imageURL;
                self.imageEnabled = data.imageEnabled;
                self.letters = getLetters(self.answer);
                self.answerLetters = self.answer.toUpperCase().split('');
                self.userAnswerLetters = getUserAnswer(self.answerLetters.length);
                if (!QuizData.canShowQuestion(self.questionId)) {
                    //we already have this question
                    $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
                }

                addReactComponent();
                lastEmpty = 0;
            });

    });

    var updateLastEmpty = function(){
        for(var i=0; i < self.userAnswerLetters.length; i++){
            if(self.userAnswerLetters[i] == "AAA"){
                lastEmpty = i;
                return;
            }
            lastEmpty = self.userAnswerLetters.length;
        }
    };

    self.addLetter = function(idx){
        if(lastEmpty < self.answerLetters.length){
            self.userAnswerLetters[lastEmpty] = self.letters[idx];
            self.letters.splice(idx,1);
            updateLastEmpty();
        }
        if(lastEmpty == self.userAnswerLetters.length){
            QuizData.answerQuestion(self.questionId,
                                self.userAnswerLetters.join("").toUpperCase(),
                                self.answer.toUpperCase(),
                                self.question,
                                Math.max(new Date().getTime() - startTime - 2000, 0)
                            );
            // $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
        }
        renderReactComponent();

    };

    self.removeLetter = function(idx){
        var letter = self.userAnswerLetters[idx];
        if(idx < lastEmpty) {
            self.letters.push(letter);
            self.userAnswerLetters[idx] = "AAA";
            updateLastEmpty();
        }
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



    $log.debug("Scrambled Controller", self);
}]);
