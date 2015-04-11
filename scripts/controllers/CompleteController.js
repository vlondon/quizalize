
angular.module('quizApp').controller('CompleteController', ['QuizData', '$log', '$location', function(QuizData, $log){
    var self = this;

    var calculateTotals = function(items){
        var t = {seconds: 0, score: 0};
        for(var j in items){
            var item = items[j];
            t.score += item.score;
            t.seconds += item.seconds;
            if (item.topicId!=undefined) {
                if (self.alltopics[item.topicId]!=undefined) {
                    if (self.alltopics[item.topicId].stats==undefined) {
                        if (self.alltopics[item.topicId].attainment==undefined) {
                            self.alltopics[item.topicId].attainment = {
                                'red': 0.1,
                                'amber': 0.4,
                                'green': 0.7,
                                'blue': 0.9,
                                'class': 65
                            };
                        }
                        self.alltopics[item.topicId].stats = {
                            score: 0,
                            correct: 0,
                            answered: 0,
                            seconds: 0,
                            percentage: 0
                        }
                    }
                    self.alltopics[item.topicId].stats.score+=item.score;
                    self.alltopics[item.topicId].stats.seconds+=item.seconds;
                    if (item.correct!=undefined) {
                        self.alltopics[item.topicId].stats.correct+=(item.correct==true?1:0);
                        self.alltopics[item.topicId].stats.answered++;
                        self.alltopics[item.topicId].stats.percentage = (self.alltopics[item.topicId].stats.correct/self.alltopics[item.topicId].stats.answered)*100;
                        if (self.alltopics[item.topicId].stats.percentage>=self.alltopics[item.topicId].attainment['blue']*100) {
                            self.alltopics[item.topicId].stats.state = 'b';
                        }
                        else if (self.alltopics[item.topicId].stats.percentage>=self.alltopics[item.topicId].attainment['green']*100) {
                            self.alltopics[item.topicId].stats.state = 'g';
                        }
                        else if (self.alltopics[item.topicId].stats.percentage>=self.alltopics[item.topicId].attainment['amber']*100) {
                            self.alltopics[item.topicId].stats.state = 'a';
                        }
                        else if (self.alltopics[item.topicId].stats.percentage>=self.alltopics[item.topicId].attainment['red']*100) {
                            self.alltopics[item.topicId].stats.state = 'r';
                        }
                    }
                }
            }
        }
        //only show topics for which we have data
        for (i in self.alltopics) {
            if (self.alltopics[i].stats!=undefined) {
                self.topics[i]=self.alltopics[i];
            }
        }
        t.score = Math.round(t.score);
        return t;
    };

    self.data = QuizData.currentQuizData;
    self.studentData = QuizData.getStudentData();
    self.topics = {};
    self.alltopics = QuizData.getTopics();

    self.totals = calculateTotals(QuizData.currentQuizData.report);

    $log.debug("Complete Controller", self);

    self.logout = function(){
        QuizData.logout();
    }
}]);
