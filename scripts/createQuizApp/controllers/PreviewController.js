angular.module('createQuizApp').controller('PreviewController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams,$location){

    var self = this;
    self.emailAddress = "";
    self.className = "";
    self.publishing = false;
 
    self.id = $routeParams.id;
    if(self.id==undefined) $location.path("/");

    self.publish = function(){
        var details = { emailAddress: self.emailAddress, access: -1, groupName: self.className };
        if (QuizData.getUser()!=self.quiz.profileId && self.quiz.share) {
            details['share']=self.quiz.profileId;
        }        
        self.publishing = true;
        QuizData.registerEmailAddress(self.emailAddress).success(function(result){
            QuizData.setUser(result);
            QuizData.publishQuiz(self.quiz, details,function(err,result) {
                if (!err) {
                    $log.debug("Response from publishing: ", result);
                    QuizData.addClass(result.groupName,result.code,result.link);
                    $location.path("/published/"+self.id+"/b");                    
                }
                else {
                    $log.debug("Error from publishing: ", err,message);
                    QuizData.showMessage("Error Publishing","Please contact Quizalize ASAP");
                }
                self.publishing = false;
            });
        }).error(function(err){
            $log.debug("Error from publishing: ", err);
            QuizData.showMessage("Error Publishing","It seems this email has been used with Quizalize/Zzish. Please login using the button at the top menu to continue or use a different email.");
            self.publishing = false;
        });
    };

    self.focusClassCode = function() {
        $("#className").focus();
    }

    self.canSubmit = function() {
        return self.emailAddress.length == 0 || self.className.length==0 || self.publishing;
    }

    if (!QuizData.getUser()) {
        QuizData.getQuiz(self.id, false, function(qz){
            self.quiz = qz;
            $log.debug(self);
        });
    }
    else {
        $location.path("/published/"+self.id+"/p");
    }
}]);
