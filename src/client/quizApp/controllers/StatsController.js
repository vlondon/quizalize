angular.module('quizApp').controller('StatsController', ['QuizData', '$log', '$location','$rootScope', function(QuizData, $log, $location,$rootScope){
    var self = this;
    self.loadingStats = true;
    self.name = QuizData.getUsername();

    QuizData.loadStats(function(err,stats) {
        self.loadingStats = false;
        self.data = stats;
        self.total = {};
        var percentage = 0;
        var count = 0;
        var score = 0;
        self.data.data.forEach(function(quiz) {
            var include = false;
            if (quiz.correct && quiz.answered) {
                quiz.percentage = quiz.correct * 100 / quiz.answered;
                percentage += quiz.percentage;
                if (quiz.percentage <= 30) {
                    quiz.state = "bar-block-r";
                }
                else if (quiz.percentage <= 50) {
                    quiz.state = "bar-block-a";
                }
                else if (quiz.percentage <= 70) {
                    quiz.state = "bar-block-g";
                }
                else  {
                    quiz.state = "bar-block-b";
                }
                include = true;
            }
            if (quiz.score) {
                score += quiz.score;
                include = true;
            }
            if (include) {
                count++;
            }
        });
        self.total.avg_score = score/count;
        self.total.avg_percentage = percentage/count;
    });
}]);
