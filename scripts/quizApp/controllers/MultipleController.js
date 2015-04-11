angular.module('quizApp')
    .controller('MultipleController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log,  $routeParmas, $location){
        var self = this;
        var startTime = (new Date()).getTime();

        self.questionId = parseInt($routeParmas.questionId);
        $log.debug("On question", self.questionId);

        self.score = QuizData.currentQuizData.totalScore;
        self.questionCount = QuizData.currentQuizData.questionCount;

        QuizData.getQuestion(self.questionId, function(data){
            self.question = data.question;
            self.answer = data.answer;
            self.alternatives = QuizData.getAlternatives(self.questionId);

            self.longMode = false;
            for(var i in self.alternatives){
                if(self.alternatives[i].length > 10){
                    self.longMode = true;
                }
            }
        });

        self.select = function(idx){
            QuizData.answerQuestion(self.questionId,
                                    self.alternatives[idx],
                                    self.answer,
                                    self.question,
                                    (new Date()).getTime() - startTime);
        };

        $log.debug("Multiple Controller", self);
    }]);
