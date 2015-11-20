var React = require('react');
var ReactDOM = require('react-dom');

var CQQuizOfTheDay = require('createQuizApp/components/CQQuizOfTheDay');
var QLLeaderboard = require('quizApp/components/QLLeaderboard');

angular.module('quizApp').controller('GameController', function(QuizData, ExtraData, $log, $location, $rootScope, $routeParams, $scope){
    var self = this;

    self.id = $routeParams.id;
    self.catId = $routeParams.catId;
    self.numQuestions = "the";
    self.randomText = ".";
    self.showSubText = false;
    self.noResultMode = false;

    if (window.ga){
        window.ga('send', 'event', 'quiz', 'start', self.id);
    }

    var renderReactComponent = function(){
        ReactDOM.render(React.createElement('div', {className: 'qofd-intro'},
            ReactDOM.createElement(CQQuizOfTheDay, {
                quiz: self.currentQuiz,
                showActions: false
            }),
            ReactDOM.createElement(QLLeaderboard, {
                leaderboard: self.leaderboard
            })),

            document.getElementById('reactContainer')
        );
    };


    var addReactComponent = function(){
        setTimeout(renderReactComponent, 200);
        $scope.$on('$destroy', function(){
            ReactDOM.unmountComponentAtNode(document.getElementById('reactContainer'));
        });
    };


    var getLeaderBoard = function(quiz){
        console.log('loading score for ', quiz.uuid);
        ExtraData.getLeaderBoard(quiz.uuid)
            .then(function(result){
                self.leaderboard = result;
                addReactComponent();
            });

    };



    QuizData.selectQuiz(self.catId, self.id, function(err, result) {
        if (!err) {
            self.currentQuiz = result;
            if (localStorage.getItem("classCode")) {
                window.Intercom('boot', {
                  app_id: window.intercomId,
                  user_id: result.meta.profileId // Optional: Replace with a unique identifier that won't change
                });
                window.Intercom('update', {
                  app_id: window.intercomId,
                  user_id: result.meta.profileId // Optional: Replace with a unique identifier that won't change
                });
                window.Intercom('update');
                window.Intercom('trackEvent', 'class-quiz', {
                    classCode: localStorage.getItem("classCode"),
                    quizId: self.currentQuiz.uuid
                });
                window.Intercom('shutdown');
            }


            if (self.currentQuiz.meta) {

                if (self.currentQuiz.meta['random']) {
                    self.randomText = " in random order.";
                    self.showSubText = true;
                }
                if (self.currentQuiz.meta.showResult == 0) {
                    self.noResultMode = true;
                }
                if (self.currentQuiz.meta['numQuestions']) {
                    self.numQuestions = self.currentQuiz.questions.length;
                    try {
                        self.numQuestions = Math.min(parseInt(self.currentQuiz.meta['numQuestions']),self.currentQuiz.questions.length);
                    }
                    catch (e) {

                    }
                    self.showSubText = true;
                }
                console.log('self.currentQuiz.meta', self.currentQuiz);
                if (self.currentQuiz.meta.featured) {
                    // addReactComponent();
                    //getLeaderBoard(self.currentQuiz);
                }
                console.log('self.currentQuiz, ', self.currentQuiz);
                if (self.catId !== 'private'){
                    QuizData.startCurrentQuiz();
                }
            }
        }
    });

    self.start = function(){
        var url = "/quiz/" + self.catId + '/' + self.id + "/question/0";
        $location.path(url);
    };

    self.return = function() {
        if (sessionStorage.getItem("mode") === "preview") {
            window.close();
        }
        else {
            $location.path("/app/");
        }
    };
});
