var settings = require('quizApp/config/settings');
var React = require('react');
var ReactDOM = require('react-dom');
var QLLeaderboard = require('quizApp/components/QLLeaderboard');
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

angular.module('quizApp').controller('CompleteController', function(QuizData, ExtraData, $log, $routeParams, $location, $scope){

    var self = this;
    self.hasTopics = false;
    self.teacherMode = sessionStorage.getItem("mode")=="teacher";
    self.previewMode = sessionStorage.getItem("mode")=="preview";
    self.demoMode = sessionStorage.getItem("mode")=="demo";
    sessionStorage.removeItem("mode");
    self.QLQuestion = false;
    self.id = $routeParams.quizId;
    self.catId = $routeParams.catId;

    if (window.ga){
        window.ga('send', 'event', 'quiz', 'end', self.id);
    }

    QuizData.loadQuiz(self.catId, self.id, function(data) {
        self.currentQuiz = data;
    });


    var renderReactComponent = function(){
        var activityId = self.data ? self.data.currentActivityId : undefined;
        ReactDOM.render(
            React.createElement(QLLeaderboard, {
                leaderboard: self.leaderboard,
                activityId
            }),
            document.getElementById('reactContainer')
        );
    };


    var addReactComponent = function(){
        setTimeout(renderReactComponent, 200);
        $scope.$on('$destroy', function(){
            ReactDOM.unmountComponentAtNode(document.getElementById('reactContainer'));
        });
    };



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
    self.quiz = QuizData.currentQuizResult();

    self.topics = {};

    var localStorageQuiz = JSON.parse(localStorage.getItem('currentQuiz') || '{}');

    self.isFeatured = localStorageQuiz.meta!=null ? localStorageQuiz.meta.featured : false;
    // self.isFeatured = false;

    if (self.isFeatured === true) {
        ExtraData.getLeaderBoard(self.data.quizId)
            .then(function(score){
                self.leaderboard = score;
                self.facebookLink = `http://www.facebook.com/sharer/sharer.php?u=http://quizalize.com/qapp/${self.data.quizId}`;
                self.twitterLink = `http://twitter.com/home?status=${window.encodeURIComponent('I played ' + localStorageQuiz.meta.name + ' on @Quizalizeapp and I got ' + self.totals.score + ' points. http://www.quizalize.com/qapp/' + self.data.quizId)}`;
                //addReactComponent();
            });
    }
    // QuizData.selectQuiz(self.catId, self.id, function(err, result) {
    //     if (!err) {
    //     }
    // });

    QuizData.getTopics(function(data) {
        self.alltopics = data;
        self.totals = calculateTotals(self.data.report);
        var needToHide = false;
        var items = self.data.report;
        var arrayToMath = [];
        for(var j in items){
            var item = items[j];
            if (item.latexEnabled) {
                arrayToMath.push(item.questionId);
                needToHide = true;
            }
        }
        if (needToHide) {
            setTimeout(function() {
                for (var i in arrayToMath) {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#quizQuestion" + arrayToMath[i])[0]]);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#response" + arrayToMath[i])[0]]);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#cresponse" + arrayToMath[i])[0]]);
                }
            }, 200);
            MathJax.Hub.Queue(function () {
                $scope.$apply(function() {
                    self.QLQuestion = true;
                });
            });
        }
        self.QLQuestion = true;
        // renderReactComponent();
    },self.previewMode);


    $log.debug("Complete Controller", self);

    self.logout = function(){
        QuizData.logout();
    };

    self.home = function() {
        if (self.previewMode) {
            window.close();
        }
        else if (QuizData.getUser()) {
            $location.path("/list");
        }
        else {
            $location.path("/public");
        }
    };
});
