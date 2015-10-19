angular.module('quizApp').controller('PreviewController', function(QuizData, $log, $location, $rootScope, $routeParams, $scope){
    var self = this;

    self.id = $routeParams.id;

    QuizData.previewQuiz(self.id, function(quiz) {
        sessionStorage.setItem('mode', 'preview');
        sessionStorage.setItem('profileId', $routeParams.profileId);
        self.currentQuiz = quiz;
    });

    self.start = function(){
        var url = "/quiz/private/" + self.id + "/question/0";
        $location.path(url);
    };

    self.return = function() {
        window.close();
    };

});
