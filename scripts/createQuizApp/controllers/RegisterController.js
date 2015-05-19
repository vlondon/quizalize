angular.module('createQuizApp').controller('RegisterController', ['QuizData', '$log', '$http', '$location', '$routeParams', function(QuizData, $log, $http, $location,$routeParams){
    var self = this;
    self.registering = false;
    self.emailAddress="";
    self.registering = false;
    self.postAction = $routeParams.postAction;

    self.registerEmail = function() {
        self.registering = true;
        QuizData.registerEmailAddress(self.emailAddress).success(function(result){
            QuizData.setUser(result);
            $location.path("/success/" + self.postAction + "/noid");
        }).error(function(err){
            QuizData.showMessage("Registration Error","There seems to be an error with your email address. This is the error we got: "+err,function() {
                self.registeringNow = false;  
                self.emailAddress="";                  
                angular.element('#emailAddress').trigger('focus');
            });
        });
    }

}]);
