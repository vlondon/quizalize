angular.module('quizApp').controller('NavBarController', function(QuizData,$log, $timeout,$location){
    var self = this;

    self.confirmed = function() {
        QuizData.confirmed($("#modalUuid").val());
    };

    self.logout = function() {
    	QuizData.unsetUser();
    	$location.path("/");
    };

    self.loadApp = function() {
        $location.path("/app");
    };

    self.loggedIn = QuizData.getUser();
});
