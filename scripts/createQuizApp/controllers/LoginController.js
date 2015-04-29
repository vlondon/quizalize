angular.module('createQuizApp').controller('LoginController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

    self.email = "";
    self.password = "";

    self.focusPassword = function() {
    	$('#password').focus();
    }

    var authenticate = function(email,password) {
        return $http.post("/user/authenticate");    
    }

    var showLogin = function() {

    }

    var showRegister = function() {
        $log.debug("Show Register");
    }

    self.login = function() {
    	authenticate(self.email,self.password).success(function(resp){
            $log.debug("Response",resp);    
        }).error(function(er){
            $log.debug("Error ", er);
        });
    }
}]);
