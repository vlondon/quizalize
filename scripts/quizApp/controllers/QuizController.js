angular.module('quizApp')
    .controller('QuizController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParams, $location){

    var startTime = (new Date()).getTime();

    var getLetters = function(answer){
        var letters = answer.toUpperCase().split('');
        letters.push('E');
        letters.push('T');
        letters.push('P');
        var letterSet = {};
        for(var idx in letters){
            letterSet[letters[idx]] = true;
        }
        var ls = [];
        for(var l in letterSet){
            ls.push(l);
        }
        return ls.sort();
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

    self.id = $routeParams.quizId;
    self.catId = $routeParams.catId;

    self.questionId = parseInt($routeParams.questionId);
    $log.debug("On question", self.questionId);

    self.score = QuizData.currentQuizData.totalScore;
    self.questionCount = QuizData.currentQuizData.questionCount;
    var lastEmpty = 0;

    var getQuestion = function(){
        QuizData.getQuestion(self.questionId, function(data){
            self.question = data.question;
            self.answer = replaceSpaces(data.answer);

            self.letters = getLetters(self.answer);
            self.answerLetters = self.answer.toUpperCase().split('');
            self.userAnswerLetters = getUserAnswer(self.answerLetters.length);

            lastEmpty = 0;
        });

    }
    
    if (self.id && self.catId) {
        QuizData.selectQuiz(self.catId, self.id, getQuestion);
    } else {
        getQuestion();
    }

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
            updateLastEmpty();
        }
    };

    self.removeLetter = function(idx){
        self.userAnswerLetters[idx] = "_";
        updateLastEmpty();
    };

    self.submit = function(){
        if(self.userAnswerLetters[self.userAnswerLetters.length - 1] != "_"){
            QuizData.answerQuestion(self.questionId,
                                self.userAnswerLetters.join("").toUpperCase(),
                                self.answer.toUpperCase(),
                                self.question,
                                (new Date()).getTime() - startTime
            );
        }else{
            //Must give full answer...
        }
    };

    $log.debug("Quiz Controller", self);

}]);
