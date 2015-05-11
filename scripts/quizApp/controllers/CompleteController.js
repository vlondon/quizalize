var settings = require('quizApp/config/settings');

var maxScore = settings.maxScore;
var maxTime = settings.maxTime;
var minScore = settings.minScore;
var gracePeriod = settings.gracePeriod;

angular.module('quizApp').controller('CompleteController', ['QuizData', '$log', '$location', function(QuizData, $log){
    var self = this;
    var hasTopics = false;
    self.teacherMode = !!sessionStorage.getItem("teacher");
    sessionStorage.removeItem("teacher");

    var calculateTotals = function(items){
        self.topics = {};
        self.hasTopics = false;
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
                        if (self.alltopics[item.topicId].stats.score>=self.alltopics[item.topicId].stats.answered*maxScore*0.9) {
                            self.alltopics[item.topicId].stats.state = 'b';
                        }
                        else if (self.alltopics[item.topicId].stats.score>=self.alltopics[item.topicId].stats.answered*maxScore*0.7) {
                            self.alltopics[item.topicId].stats.state = 'g';
                        }
                        else if (self.alltopics[item.topicId].stats.score>=self.alltopics[item.topicId].stats.answered*maxScore*0.4) {
                            self.alltopics[item.topicId].stats.state = 'a';
                        }
                        else if (self.alltopics[item.topicId].stats.score>=0) {
                            self.alltopics[item.topicId].stats.state = 'r';
                        }
                    }
                }
            }
        }
        //only show topics for which we have data
        for (var i in self.alltopics) {
            if (self.alltopics[i].stats!=undefined) {
                self.hasTopics = true;
                self.topics[i]=self.alltopics[i];
            }
        }
        t.score = Math.round(t.score);
        return t;
    };

    self.data = QuizData.currentQuizResult();
    self.topics = {};
    self.alltopics = QuizData.getTopics();

    self.totals = calculateTotals(self.data.report);

    $log.debug("Complete Controller", self);

    self.logout = function(){
        QuizData.logout();
    }
}]);
