var settings = require('quizApp/config/settings');
// var React = require('react');
// var QLComplete = require('quizApp/components/QLComplete');

var maxScore = settings.maxScore;
var maxTime = settings.maxTime;
var minScore = settings.minScore;
var gracePeriod = settings.gracePeriod;

MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    showProcessingMessages: false,
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
      processEscapes: true
    },    
    "HTML-CSS": { availableFonts: ["TeX"] }
});
MathJax.Hub.Configured();   

angular.module('quizApp').controller('CompleteController', ['QuizData', '$log', '$location', '$scope', function(QuizData, $log, $location, $scope){
    var self = this;
    self.hasTopics = false;
    self.teacherMode = sessionStorage.getItem("mode")=="teacher";
    self.previewMode = sessionStorage.getItem("mode")=="preview";
    sessionStorage.removeItem("mode");
    self.showButtons = false;

    // var renderReactComponent = function(){
    //     React.render(
    //         React.createElement(QLComplete, {
    //             totals: self.totals
    //         }),
    //         document.getElementById('reactContainer')
    //     );
    // };
    //
    //
    // var addReactComponent = function(){
    //     setTimeout(renderReactComponent, 200);
    //     $scope.$on('$destroy', function(){
    //         React.unmountComponentAtNode(document.getElementById('reactContainer'));
    //     });
    // };

    // addReactComponent();

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
    QuizData.getTopics(function(data) {
        self.alltopics = data;
        self.totals = calculateTotals(self.data.report);
        if (self.data.latexEnabled) {
            setTimeout(function() {                
                var items = self.data.report;
                for(var j in items){
                    var item = items[j];
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#quizQuestion"+item.questionId)[0]]);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#response"+item.questionId)[0]]);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#cresponse"+item.questionId)[0]]);
                }
                MathJax.Hub.Queue(function () {
                    $scope.$apply(function() {
                        self.showButtons = true;
                    });
                });
            },200);
            self.showButtons = true;
        }
        else {
            self.showButtons = true;
        }

        // renderReactComponent();
    });


    $log.debug("Complete Controller", self);

    self.logout = function(){
        QuizData.logout();
    };

    self.home = function() {
        if (self.previewMode) {
            window.close();
        }
        else {
            $location.path("/list");
        }
    };
}]);
