var randomise = require('quizApp/utils/randomise');
var React = require('react');
var QLScrambled = require('quizApp/components/QLScrambled');

angular.module('quizApp').controller('ScrambledController', ['QuizData', '$log', '$routeParams', '$location', '$scope', function(QuizData, $log,  $routeParams, $location, $scope){

    var getLetters = function(answer){

        var letters = answer.toUpperCase().split('');
        // letters.push('C');
        // letters.push('R');
        // letters.push('E');
        return randomise(letters);
    };

    var getUserAnswer = function(n){
        var ans = [];
        for(var i = 0; i < n; i++){
            ans.push('_');
        }
        return ans;
    };

    var arrayMatch = function(a,b){
        if(a.length !== b.length){
            return false;
        }
        for(var i = 0; i < a.length; i++){
            if(a[i] !== b[i]){
                return false;
            }
        }
        return true;
    };

    var replaceSpaces = function(s){
        return s.replace(/\s+/g, '_');
    };

    var self = this;
    var startTime = (new Date()).getTime();

    self.id = $routeParams.quizId;
    self.catId = $routeParams.catId;
    self.questionId = parseInt($routeParams.questionId);
    $log.debug('On question', self.questionId);

    self.score = QuizData.currentQuizData.totalScore;
    self.questionCount = QuizData.currentQuizData.questionCount;

    var lastEmpty;

    var renderReactComponent = function(){
        React.render(
            React.createElement(QLScrambled, {
                quizData: QuizData.currentQuizData,
                question: self.question,
                letters: self.letters,
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


    var getQuestion = function(){
        QuizData.getQuestion(self.questionId, function(data){
            self.question = data.question;
            self.answer = replaceSpaces(data.answer);

            self.letters = getLetters(self.answer);
            self.answerLetters = self.answer.toUpperCase().split('');
            self.userAnswerLetters = getUserAnswer(self.answerLetters.length);

            if (QuizData.currentQuizData.report[self.questionId] !== undefined) {
                //we already have this question
                $location.path('/quiz/answer/' + self.questionId);
            } else {
                addReactComponent();
            }

            lastEmpty = 0;
        });
    }

    if (self.id && self.catId){
        QuizData.selectQuiz(self.catId, self.id, getQuestion);
    } else {
        getQuestion();
    }

    var updateLastEmpty = function(){
        for(var i = 0; i < self.userAnswerLetters.length; i++){
            if(self.userAnswerLetters[i] === '_'){
                lastEmpty = i;
                return;
            }
            lastEmpty = self.userAnswerLetters.length;
        }
    };

    self.addLetter = function(idx){
        if(lastEmpty < self.answerLetters.length){
            self.userAnswerLetters[lastEmpty] = self.letters[idx];
            self.letters.splice(idx, 1);
            updateLastEmpty();
        }

        if (lastEmpty === self.userAnswerLetters.length
            && QuizData.currentQuizData.report[self.questionId] === undefined){
            QuizData.answerQuestion(self.questionId,
                                self.userAnswerLetters.join('').toUpperCase(),
                                self.answer.toUpperCase(),
                                self.question,
                                (new Date()).getTime() - startTime);
        }
    };

    self.removeLetter = function(idx){
        var letter = self.userAnswerLetters[idx];
        if(letter !== '_') {
            self.letters.push(letter);
            self.userAnswerLetters[idx] = '_';
            updateLastEmpty();
        }
    };

    $log.debug('Scrambled Controller', self);
}]);
