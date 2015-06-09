var React = require('react');
var QuizFormat = require('createQuizApp/actions/format/QuizFormat');
var CQQuizOfTheDay = require('createQuizApp/components/CQQuizOfTheDay');
var QLLeaderboard = require('quizApp/components/QLLeaderboard');

angular.module('quizApp').controller('GameController', function(QuizData, ExtraData, $log, $location, $rootScope, $routeParams, $scope){
    var self = this;

    self.id = $routeParams.id;
    self.catId = $routeParams.catId;
    self.numQuestions = "the";
    self.randomText = ".";
    self.showSubText = false;

    var renderReactComponent = function(){
        React.render(React.createElement('div', {className: 'qofd-intro'},
            React.createElement(CQQuizOfTheDay, {
                quiz: self.currentQuiz,
                showActions: false
            }),
            React.createElement(QLLeaderboard, {
                leaderboard: self.leaderboard
            })),

            document.getElementById('reactContainer')
        );
    };


    var addReactComponent = function(){
        setTimeout(renderReactComponent, 200);
        $scope.$on('$destroy', function(){
            React.unmountComponentAtNode(document.getElementById('reactContainer'));
        });
    };


    var getLeaderBoard = function(quiz){
        console.log('loading score for ', quiz.uuid);
        ExtraData.getLeaderBoard(quiz.uuid)
            .then(function(result){
                self.leaderboard = result;
                renderReactComponent();
            });

    };



    QuizData.selectQuiz(self.catId, self.id, function(err, result) {
        if (!err) {
            self.currentQuiz = QuizFormat.process(result);
            getLeaderBoard(self.currentQuiz);
            if (self.currentQuiz.settings) {

                if (self.currentQuiz.settings['random']) {
                    self.randomText = " in random order.";
                    self.showSubText = true;
                }

                if (self.currentQuiz.settings['numQuestions']) {
                    self.numQuestions = self.currentQuiz.questions.length;
                    try {
                        self.numQuestions = Math.min(parseInt(self.currentQuiz.settings['numQuestions']),self.currentQuiz.questions.length);
                    }
                    catch (e) {

                    }
                    self.showSubText = true;
                }
                console.log('self.currentQuiz.settings', self.currentQuiz);
                if (self.currentQuiz.settings.featured) {
                    addReactComponent();
                }
                console.log('self.currentQuiz, ', self.currentQuiz);
            }
        }
    });

    self.start = function(){
        var url = "/quiz/" + self.catId + '/' + self.id + "/" + QuizData.selectQuestionType(0) + "/0";
        if (self.catId !== 'private'){
            QuizData.startCurrentQuiz();
        }
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

    self.cancel = function() {
        QuizData.confirmWithUser("Cancel Quiz", "Are you sure you want to cancel '" + QuizData.currentQuiz().name + "'. You won't be able to continue this quiz.", function() {
            if (sessionStorage.getItem("mode") === "teacher") {
                window.location.href = "/quiz#/public";
            }
            else if (sessionStorage.getItem("mode") === "preview") {
                window.close();
            }
            else {
                $location.path("/list");
            }
        });
    };

});
