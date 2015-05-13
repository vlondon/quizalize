angular.module('createQuizApp').controller('SignupController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', '$scope',function(QuizData, $log, $location,$rootScope,$routeParams,$scope){
    var self = this;

    self.id = $routeParams.id;
    self.emailAddress = "";

    sessionStorage.setItem("mode","teacher");
    
    self.canSubmit = function() {
        return self.emailAddress=='';
    }

    self.register = function() {
        if (self.emailAddress!="") {
            QuizData.registerEmailAddress(self.emailAddress).success(function(result){
                QuizData.setUser(result);
                $location.path("/success/preview/"+self.id);                    
            }).error(function(err){
                $log.debug("Error from publishing: ", err);
                QuizData.showMessage("Error Publishing","It seems this email has been used with Quizalize/Zzish. Please login using the button at the top menu to continue or use a different email.");
                self.publishing = false;
            });            
        }
    }
}]);
