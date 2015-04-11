angular.module('quizApp').controller('ScrambledController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParmas, $location){
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
            ans.push("_");
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

    var replaceSpaces = function(s){
        return s.replace(/\s+/g, "_");
    };

    var self = this;
    var startTime = (new Date()).getTime();

    self.questionId = parseInt($routeParmas.questionId);
    $log.debug("On question", self.questionId);

    self.score = QuizData.currentQuizData.totalScore;
    self.questionCount = QuizData.currentQuizData.questionCount;

    var lastEmpty;

    QuizData.getQuestion(self.questionId, function(data){
        self.question = data.question;
        self.answer = replaceSpaces(data.answer);

        self.letters = getLetters(self.answer);
        self.answerLetters = self.answer.toUpperCase().split('');
        self.userAnswerLetters = getUserAnswer(self.answerLetters.length);

        lastEmpty = 0;
    });

    var updateLastEmpty = function(){
        for(var i=0; i < self.userAnswerLetters.length; i++){
            if(self.userAnswerLetters[i] == "_"){
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
                                (new Date()).getTime() - startTime);
        }
    };

    self.removeLetter = function(idx){
        var letter = self.userAnswerLetters[idx];
        if(letter != "_") {
            self.letters.push(letter);
            self.userAnswerLetters[idx] = "_";
            updateLastEmpty();
        }
    };

    $log.debug("Scrambled Controller", self);
}]);
