angular.module('createQuizApp').controller('PreviewController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams,$location){

    var self = this;
    self.emailAddress = localStorage.getItem("emailAddress");
    self.published = false;
    self.userVerified = localStorage.getItem("userVerified")=="true";

    self.id = parseInt($routeParams.id);
    if(isNaN(self.id)) $location.path("/");

    self.publish = function(){
        $log.debug("Publish with email address:", self.emailAddress, "Quiz:", self.quiz);
        self.statusText = "";

        if(self.userVerified || self.classCode || self.emailAddress){
            if(self.emailAddress && self.emailAddress.length > 0){
		      localStorage.setItem("emailAddress",self.emailAddress);
            }
	       self.publishing = true;

            var details = { emailAddress: self.emailAddress, access: -1 };
            if(self.classCode) details.code = self.classCode;
            $log.debug("Publishing with details", details, "Quiz", self.quiz);

            QuizData.publishQuiz(self.quiz, details).success(function(result){
                $log.debug("Response from publishing: ", result);
                if (result.status==200) {
                    self.classCode = result.code;
                    self.fullLink = result.link;
                    localStorage.setItem("link",self.fullLink);
                    QuizData.saveClassCode(self.classCode);
                    $("#LoginButton").html("Logout");
                    $("#LoginButton").show();                    
                    $location.path("/published/"+self.id+"/b");                    
                }
                else {
                    QuizData.showMessage("Error Publishing","It seems this email has been used with Quizalize/Zzish. Please login using the button at the top menu to continue or use a different email.");
                }
                self.publishing = false;
            }).error(function(err){
                $log.debug("Error from publishing: ", err);
                self.statusText = err;
            });

        }else{
            self.statusText = "Please provide an email address"
        }
    };

    QuizData.getQuiz(self.id, false, function(qz){
        self.quiz = qz;

        self.classCode = QuizData.getClassCode();

        if(self.classCode || self.userVerified){
           $location.path("/published/"+self.id+"/p");
        }

        $log.debug(self);
    });
}]);
