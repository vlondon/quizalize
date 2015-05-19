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
        $("#title").html("Quizalize Login");
        $("#email").val("");
        $("#password").val("");
        $("#LoginButton span").text("Log in");
        $("#passwordSpan ").show();
    }

    self.showRegister = function() {
        self.mode = "register";
        $log.debug("Show Register");
        $("#passwordSpan").show();
        $("#email").val("");
        $("#password").val("");        
        $("#title").html("Quizalize Registration");
        $("#LoginButton span").text("Sign up");
    }

    self.showForget = function() {
        self.mode = "forget";
        $("#title").html("Password Reset");
        $("#email").val("");
        $("#password").val("");        
        $("#passwordSpan").hide();
        $("#LoginButton span").text("Reset Password");
    }

    self.initialScreen = $routeParams.init;

    if (self.initialScreen=='login') {
        self.showLogin();
    }
    else if (self.initialScreen=='register') {
        self.showRegister();
    }
    else if (self.initialScreen=='forget') {
        self.showForget();
    }    

    self.checkCanSubmit = function() {                
        return self.mode =='forget' ? self.email=='' : (self.email=='' || self.password=='');
    }

    self.login = function() {
        if (self.mode=="login") {
            authenticate(self.email,self.password).success(function(resp){
                QuizData.setUser(resp);
                $location.path("/quiz#/");
                $log.debug("Response",resp);    
            }).error(function(er,status){
                QuizData.showMessage("Login Error","Invalid Details during login");
                //$log.debug("Error ", er);
            });
        }
        else if (self.mode=="register") {
            register(self.email,self.password).success(function(resp){
                QuizData.showMessage("Registration Successful","Thanks for registering! Let's now create a quiz",function() {
                    $log.debug("Response",resp);    
                    QuizData.setUser(resp);
                    $location.path("/quiz#/");                    
                });
            }).error(function(err,status){                
                var message = "Invalid Registration";
                if (status==409) {
                    message = "This email has already been used";
                }
                QuizData.showMessage("Registration Error",message);
                //$log.debug("Error ", er);
            });
        }
        else if (self.mode=="forget") {
            forget(self.email).success(function(resp){
                //$log.debug("Response",resp);    
                QuizData.showMessage("Reset Password","If you are registered, please check your email for instructions on how to reset your password");
            }).error(function(er){
                QuizData.showMessage("Reset Error","The email address you entered doesn’t match a Quizalize user");
                //QuizData.showMessage("Error with resetting password",er);
                //$log.debug("Error ", er);
            });
        }
    }
}]);
