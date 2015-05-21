angular.module('createQuizApp').controller('QuizzesController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    self.hasOwnQuizzes = false;
    self.notPublic = 
    self.shareEmails = "";
    self.currentQuizToShare = undefined;
    self.quizzes = [];

    var loadQuizData = function() {
        QuizData.getTopics(function(data){
            self.topics = {};
            for (var i in data) {
                self.topics[data[i].uuid] = data[i];
            }
            QuizData.getQuizzes(function(data){
                self.pastQuizzes = data;
                for (var i in self.pastQuizzes) {
                    if (!self.pastQuizzes[i].publicAssigned) {
                        self.hasOwnQuizzes = true;
                        self.quizzes.push(self.pastQuizzes[i]);                        
                    }
                } 
                QuizData.getGroupContents(function(data) {
                    self.groupContents = data;
                })                       
            });            
        });
    }    

    var getIdxForQuiz = function(quiz) {
        var idx = 0;
        for (var i in self.pastQuizzes) {
            if (self.pastQuizzes[i].uuid==quiz.uuid) {
                break;
            }
            idx++;
        }
        return idx;        
    }

    if (QuizData.getUser()) {
        loadQuizData();
    }
    else {
        $location.path("/quiz#/");
    }

    self.editQuiz = function(quiz){
        $location.path("/create/" + quiz.uuid);
    };

    self.deleteQuiz = function(quiz){
        var found = false;
        for (var i in self.groupContents) {
            for (var j in self.groupContents[i].contents) {
                if (self.groupContents[i].contents[j].contentId==quiz.uuid) {
                    found = true;
                    QuizData.showMessage("Cannot Delete","You cannot delete this quiz as you have this quiz assigned in class");
                    break;                                    
                }
            }
            if (found) break;
        }
        if (!found) {
            QuizData.confirmWithUser("Confirm Delete","Are you sure you want to permanently delete this quiz?",function() {
                $location.path("/delete/" + quiz.uuid);
            });            
        }
    };

    self.assignQuiz = function(quiz){
        $location.path("/assign/"+quiz.uuid);
    };

    self.previewQuiz = function(quiz){
        //$location.path("/app#/play/B/{{quiz.uuid}}");        
    };

    self.unpublishQuiz = function(quiz){
        QuizData.unpublishQuiz(quiz).success(function(result){
            $log.debug("Response from unpublishing: ", result);
            var idx = getIdxForQuiz(quiz);
            self.pastQuizzes[idx].enabled = false;
        }).error(function(err){
            $log.debug("Error from unpublishing: ", err);
            self.statusText = err;
        });
    };

    self.republishQuiz = function(quiz,idx){
        QuizData.republishQuiz(quiz).success(function(result){
            $log.debug("Response from republishing: ", result);
            var idx = getIdxForQuiz(quiz);
            self.pastQuizzes[idx].enabled = true;
        }).error(function(err){
            $log.debug("Error from republishing: ", err);
            self.statusText = err;
        });
    };

    self.unassignPublicQuiz = function(quiz) {
        QuizData.confirmWithUser("Remove Public Quiz","Are you sure you want to remove this public quiz from your list",function() {
            QuizData.unassignAssignQuiz(quiz.uuid).success(function(result){
                $log.debug("Response from unassignging: ", result);
                self.pastQuizzes.splice(idx,1);
            }).error(function(err){
                $log.debug("Error from republishing: ", err);
                self.statusText = err;
            });        
        });
    }

    self.shareQuiz = function(quiz) {
        self.sharing = true;
        QuizData.getEncryptedLink(quiz.uuid,function(link) {
            self.currentQuizToShare = quiz;    
            self.currentQuizToShare.shareLink = "http://quizalize.com/quiz#/share/"+link;
        })        
    }

    self.shareCurrentQuiz = function() {
        if (self.currentQuizToShare!=undefined) {
            QuizData.shareQuiz(self.currentQuizToShare.uuid,self.shareEmails);
            QuizData.showMessage("Thanks for Sharing","Each of these email addresses will receive a secure email to access your quiz",function() {
                self.sharing = false;                        
            });    
        }
        else {
            self.sharing = false;    
        }
        
    }

    self.toggleLive = function(quiz) {
        QuizData.saveQuiz(quiz);
    }

    self.currentClass = QuizData.getCurrentClass();

    $log.debug(self);

}]);
