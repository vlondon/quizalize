angular.module('createQuizApp').controller('PublishedController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams,$location){

    var self = this;

    //status fields
    self.publishing = false; 
    self.published = false;
    self.shareLink = "";
    self.shareEmails = "";

    //fields
    self.currentClass = QuizData.getCurrentClass();
    if (self.currentClass!=undefined) {
        self.className = self.currentClass.name;
    }
    
    //params
    self.id = $routeParams.id;
    self.action = $routeParams.action;
    if(self.id==undefined) $location.path("/");

    self.publish = function(){
        self.className = $("#className").val();
        QuizData.getClassForName(self.className,function(classObject) {
            var details = { access: -1};
            if (classObject==undefined) {
                //new class
                details['groupName']=self.className;
            }
            else {
                details['code']=classObject.code;

            }
            self.publishing = true;
            QuizData.publishQuiz(self.quiz, details,function(err,result) {
                self.publishing = false;                    
                if (!err) {
                    $log.debug("Response from publishing: ", result);
                    self.shareLink = "http://quizalize.com/quiz#/share/"+result.shareLink;
                    if (result.code!=undefined) {
                        //new group
                        self.currentClass = QuizData.addClass(result.groupName,result.code,result.link);
                    }
                    else {
                        //existing group
                        QuizData.setCurrentClass(result.groupName,function(current) {
                            self.currentClass = current;
                        });
                    }     
                    $("#assignments").show();                                    
                    self.published=true;
                }
                else {
                    $log.debug("Error from publishing: ", err,result);
                    QuizData.showMessage("Error Publishing","Please contact Quizalize ASAP!");
                }
            });
        });
    };

    self.share = function() {
        if (self.shareEmails!="") {            
            QuizData.shareQuiz(self.id,self.shareEmails,self.shareLink);        
            QuizData.showMessage("Thanks for Sharing","Each of these email addresses will receive a secure email to access your quiz");    
        }
        else {
            QuizData.showMessage("Sharing Error","You must specify at least one email to share with");
        }
    }

    QuizData.getQuiz(self.id, false, function(qz){
        self.quiz = qz;

        if(QuizData.getUser()) {
            if (self.action=="b") {
                self.currentClass = QuizData.getCurrentClass();
                self.published = true;                
            }
            else {
                QuizData.getClassList(function(data) {
                    var classList = [];
                    for (var i in data) {
                        classList.push(data[i].name);
                    }
                    if (classList.length==1) {
                        $( "#className" ).val(classList[0]);
                    }
                    $( "#className" ).autocomplete({
                        source: classList
                    });                                    
                });
            }
        }
        else {
            $location.path("/preview/"+self.id);
        }

        $log.debug(self);
    });
}]);
