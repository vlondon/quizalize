angular.module('createQuizApp').controller('LoginController', ['QuizData', '$log', '$routeParams', '$location', '$http', function(QuizData, $log, $routeParams, $location,$http){
    var self = this;

    self.email = "";
    self.password = "";
    self.mode = "login";

    self.focusPassword = function() {
    	$('#password').focus();
    }

    var authenticate = function(email,password) {
        return $http.post("/user/authenticate",{email: email,password: password});    
    }

    var register = function(email,password) {
        return $http.post("/user/register",{email: email,password: password});    
    }

    var forget = function(email) {
        return $http.post("/user/forget",{email: email});    
    }

    self.showLogin = function() {
        self.mode = "login";
        $("#title").html("Sign into Quizalize");
        $("#LoginButton span").text("Sign in");
        $("#passwordSpan ").show();
    }

    self.showRegister = function() {
        self.mode = "register";
        $log.debug("Show Register");
        $("#passwordSpan").show();
        $("#title").html("Sign up with Quizalize");
        $("#LoginButton span").text("Sign up");
    }

    self.showForget = function() {
        self.mode = "forget";
        $("#title").html("Reset Password");
        $("#passwordSpan").hide();
        $("#LoginButton span").text("Reset Password");
    }

    self.checkCanSubmit = function() {                
        return self.email=='' || self.password=='';
    }

    self.login = function() {
        if (self.mode=="login") {
            authenticate(self.email,self.password).success(function(resp){
                $log.debug("Response",resp);    
            }).error(function(er){
                $log.debug("Error ", er);
            });
        }
        else if (self.mode=="register") {
            register(self.email,self.password).success(function(resp){
                $log.debug("Response",resp);    
            }).error(function(er){
                $log.debug("Error ", er);
            });
        }
        else if (self.model=="forget") {
            forget(self.email).success(function(resp){
                $log.debug("Response",resp);    
            }).error(function(er){
                $log.debug("Error ", er);
            });
        }
    }
}]);
