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
        QuizData.loginUser(self.name,self.classcode,function(err,resp) {
            if (!err) {
                $location.path("/list");
                goToLoggedIn();
            }
            else {
                QuizData.showMessage("Login Error","Can you check that you entered everything correct");
            }
        })
    }

    if (QuizData.isLoggedIn()) {
        //we're already logged in. Let's go to the class list
        goToLoggedIn();
    }
}]);
