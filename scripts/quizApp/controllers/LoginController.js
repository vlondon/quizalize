angular.module('quizApp').controller('LoginController', ['QuizData', '$log', '$routeParams', '$location', '$http', function(QuizData, $log, $routeParams, $location,$http){
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
                $log.debug("Response",resp);    
                QuizData.setUser(resp);
                QuizData.setClassCode(self.classcode);
                goToLoggedIn();
            }
            else {
                QuizData.showMessage("Login Error","Can you check that you entered everything correct"+er+status);
            }
        })
    }

    if (QuizData.getUser() && QuizData.getClass()) {
        //we're already logged in. Let's go to the class list
        goToLoggedIn();
    }
}]);
