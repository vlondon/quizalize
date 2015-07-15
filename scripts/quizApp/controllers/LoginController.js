angular.module('quizApp').controller('LoginController', ['QuizData', '$log', '$routeParams', '$location', '$http', '$scope', function(QuizData, $log, $routeParams, $location,$http,$scope){
    var self = this;

    self.name = "";
    self.classcode = "";

    self.focusClassCode = function() {
        $('#classcode').focus();
    }

    self.checkCanSubmit = function() {
        return self.name=='' || self.classcode=='';
    }

    var goToLoggedIn = function() {
        $location.path("/list");
    }

    self.login = function() {
        QuizData.loginUser(self.name, self.classcode, function(err,resp) {
            if (!err) {
                if (window.ga){
                    window.ga('send', 'event', 'class', 'play', self.classcode);
                }
                $location.path("/list");
                goToLoggedIn();
            }
            else {
                if (window.ga){
                    window.ga('send', 'event', 'error-class', err, resp);
                }
                QuizData.showMessage("Login Error", "Please check that you entered the class code correctly");
            }
        });
    }

    if (QuizData.isLoggedIn()) {
        //we're already logged in. Let's go to the class list
        goToLoggedIn();
    }
}]);
