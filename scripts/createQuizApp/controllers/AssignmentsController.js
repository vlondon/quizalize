angular.module('createQuizApp').controller('AssignmentsController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    self.hasPublicAssignedQuizzes = false;
    self.hasOwnQuizzes = false;

    var loadQuizData = function() {
        QuizData.getTopics(function(data){
            self.topics = {};
            for (var i in data) {
                self.topics[data[i].uuid] = data[i];
            }
            QuizData.getQuizzes(function(data){
                self.pastQuizzes = data;
                for (var i in self.pastQuizzes) {
                    if (self.pastQuizzes[i].publicAssigned) self.hasPublicAssignedQuizzes=true;
                    else self.hasOwnQuizzes = true;
                } 
                QuizData.getGroupContents(function(data) {                    
                    self.groupContents = data;
                    var arrayToLookup = [];
                    for (var i in self.groupContents) {
                        for (var j in self.groupContents[i].contents) {
                            //if (self.pastQuizzes[j])
                            var groupContent = self.groupContents[i].contents[j];
                            if (self.pastQuizzes[groupContent.contentId]==null) {
                                //might be a public or shared quiz
                                var object = {
                                    profileId: groupContent.profileOwnerId,
                                    uuid: groupContent.contentId
                                }
                                arrayToLookup.push(object);
                            }
                        }
                    }
                    if (arrayToLookup.length>0) {
                        QuizData.loadQuizData(arrayToLookup,function(result) {
                            for (var i in result) {
                                self.pastQuizzes[result[i].uuid] = result[i];
                            }
                        });
                    }
                    QuizData.getClassList(function(data) {
                        self.classList = data;    
                    });                    
                });
            });            
        });
    }    

    if (QuizData.getUser()) {
        loadQuizData();
    }
    else {
        $location.path("/");
    }

    self.unpublishQuiz = function(quizId,code){
        QuizData.unpublishQuiz(quizId,code,function(err,message) {
            QuizData.getGroupContents(function(data) {
                self.groupContents = data;
            });            
        })
    };

    $log.debug(self);
}]);
