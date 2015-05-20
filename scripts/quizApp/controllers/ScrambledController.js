var randomise = require('quizApp/utils/randomise');

angular.module('quizApp').controller('ScrambledController', ['QuizData', '$log', '$routeParams', '$location', '$scope',function(QuizData, $log,  $routeParams, $location,$scope){
    self.showButtons = false;
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

    self.id = $routeParams.quizId;
    self.catId = $routeParams.catId;
    self.questionId = parseInt($routeParams.questionId);
    $log.debug("On question", self.questionId);

    var lastEmpty;

    QuizData.loadQuiz(self.catId, self.id, function(data) {
        //
            self.currentQuiz = data;
            self.score = QuizData.currentQuizResult().totalScore;
            self.questionCount = QuizData.currentQuizResult().questionCount;
            if (self.currentQuiz.latexEnabled) {
                self.showButtons = false;
                MathJax.Hub.Config({
                    tex2jax: {inlineMath: [["$","$"],["\\(","\\)"]]}
                }); 
                setTimeout(function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#quizQuestion")[0]]);                                                
                    MathJax.Hub.Queue(function () {
                        $scope.$apply(function() {
                            self.showButtons = true;
                        });                        
                    });                    
                },200);
            }      
            else {
                self.showButtons = true;
            }           
            QuizData.getQuestion(self.questionId, function(data){
                self.question = data.question;
                self.answer = replaceSpaces(data.answer);
                self.imageURL = data.imageURL;
                self.letters = getLetters(self.answer);
                self.answerLetters = self.answer.toUpperCase().split('');
                self.userAnswerLetters = getUserAnswer(self.answerLetters.length);
                if (QuizData.currentQuizResult().report[self.questionId] !== undefined) {
                    //we already have this question
                    $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
                }
                // addReactComponent();
                lastEmpty = 0;
            }); 
        //});        
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

        if(lastEmpty == self.userAnswerLetters.length && QuizData.currentQuizResult().report[self.questionId]==undefined){
            QuizData.answerQuestion(self.questionId,
                                self.userAnswerLetters.join("").toUpperCase(),
                                self.answer.toUpperCase(),
                                self.question,
                                (new Date()).getTime() - startTime);            
            $location.path('/quiz/' + self.catId + '/' + self.quizId + "/answer/" + self.questionId);
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
