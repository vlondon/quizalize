angular.module('createQuizApp').controller('AccountController', ['QuizData', '$log', '$routeParams', '$location', '$http', function(QuizData, $log, $routeParams, $location,$http){
    var self = this;

    self.action = $routeParams.command;
    self.id = $routeParams.id;
    self.completing = false;

    if (self.action=="complete") {
        self.title = "You're almost done!";
        self.message = "Please enter a secure password."
        self.buttonName = "Complete Registration";
    }
    else if (self.action=="reset") {
        self.title = "Reset Password";
        self.message = "Please enter a new secure password.";
        self.buttonName = "Reset Password";
    }

    self.submitForm = function() {
        self.completing = true;
        var title = "Registration";
        var message = "Thank you for completing your registration";
        if (self.action=="complete") {
           
        }
        else if (self.action=="reset") {
           title = "Password Reset";
            var message = "Your Password has now been updated.";
        }                
        $http.post("/users/complete/",{code: self.id, password: self.password})
            .success(function(result){
                QuizData.setUser(result);
                QuizData.showMessage(title + " Complete","Thank you for completing your registration",function() {
                    self.completing = false;
                    $location.path("/quiz#/");
                })                
            })
            .error(function(err){
                QuizData.showMessage("Registration Error","Please contact quizalize ASAP",function() {
                    $location.path("/quiz#/");
                });
            })        
    }

    self.checkCanSubmit = function() {
        if (self.action=="complete") {
           return self.password == "";
        }
        else if (self.action=="reset") {
            return self.password == "";
        }        
        return false;
    }
}]);
