angular.module('quizApp').controller('StartController', ['QuizData', '$log', '$location','$rootScope', function(QuizData, $log, $location,$rootScope){
    var self = this;
    self.loading = false;
    self.errorMessage = "";
    self.studentName = "";
    self.classCode = "";
    self.studentCode = "";

    var reportError = function(issue){
        self.loading = false;
        self.errorMessage = issue;
    };

    self.startPublicQuiz = function(){
        console.log("Public Quiz");
        QuizData.getPublicQuizzes(function(err, res){
            $location.path("/list");
        });
    }

    self.startQuiz = function(){
        if(self.studentCode.length == 0){
            //Student name/class code login
            if(self.studentName.length == 0){
                self.errorMessage = "You must enter your name to start a quiz";
            } else if(self.classCode.length == 0){
                self.errorMessage = "You must enter a class code to start a quiz";
            } else {
                self.loading = true;
                if (QuizData.validate(self.classCode)) {
                    QuizData.register(self.studentName, self.classCode, function(err, res){
                        if(!err){
                            localStorage.setItem("zname",self.studentName);
                            localStorage.setItem("zcode",self.classCode);
                            $location.path("/list");
                        }else if (err==409){
                            reportError("Error. Chooose a different name as it seems someone else has recently used this name.");
                            $rootScope.$apply();
                        }
                        else {
                            reportError("Error. Please try entering your class code again")
                            $rootScope.$apply();
                        }
                    });
                }
                else {
                    reportError("Error. Please try entering your class code again");
                }
            }
        }else{
            self.loading = true;
            QuizData.login(self.studentCode, function(err, res){
                if(!err){
                    $location.path("/list");
                }else{
                    reportError("student code")
                }
           });
        }
    };

    if (localStorage.getItem("zname")!=undefined  && localStorage.getItem("zname")!=""
    && localStorage.getItem("zcode")!=undefined  && localStorage.getItem("zcode")!="") {
        self.classCode = localStorage.getItem("zcode");
        self.studentName = localStorage.getItem("zname");
        if (QuizData.validate(self.classCode)) {
            QuizData.register(self.studentName, self.classCode, function(err, res){
                if(!err){
                    $location.path("/list");
                }else {
                    localStorage.clear();
                }
            });
        }
        else {
            localStorage.clear();
        }
    }
}]);
