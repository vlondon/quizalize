angular.module('createQuizApp').controller('QuizzesController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    self.newQuizName = "";
    self.newQuizCategory = "";
    self.rootTopicList = [];
    self.rootTopics = [];
    self.topics = {};
    self.hasPublicAssignedQuizzes = false;
    self.hasOwnQuizzes = false;
    self.emailAddress="";
    self.registeringNow = false;

    var loadQuizData = function() {
        QuizData.getTopics(function(topics){
            if (topics) {
                for (var i in topics) {
                    if (topics[i].parentCategoryId=="-1") {
                        self.rootTopics.push(topics[i]);
                        self.rootTopicList.push(topics[i].name);
                        self.topics[topics[i].uuid]=topics[i];
                    }
                }
                $( "#category" ).autocomplete({
                    source: self.rootTopicList
                });
            }
        });
        QuizData.getQuizzes(function(data){
            self.pastQuizzes = data;
            for (var i in self.pastQuizzes) {
                if (self.pastQuizzes[i].publicAssigned) self.hasPublicAssignedQuizzes=true;
                else self.hasOwnQuizzes = true;
            }                        
            localStorage.setItem("quizData",JSON.stringify(data));
            if(self.didSupplyQuizName){
                $log.debug("Should create Quiz, with name", self.newQuizName);
               self.createQuiz();
            }
        });
    }    

    if(typeof ($location.search()).token != 'undefined'){
        //Have quiz name
        self.token = $location.search().token;
        localStorage.setItem("token",self.token);
    }
    else if (localStorage.getItem("token")!=undefined) {
        //
        self.token = localStorage.getItem("token");
    }
    else if (localStorage.getItem("userId")!=undefined) {
        //we have a userId, check to see if we have some
        self.userId = localStorage.getItem("userId");
    }
    self.previewlink = localStorage.getItem("link");
    if (self.token!=undefined) {
        $http.get("/quiz/token/"+self.token)
            .success(function(result){
                if (result=="Invalid Request") {
                    //bad token
                    localStorage.removeItem("token");
                    localStorage.removeItem("zzishtoken");
                    location.href="/quiz#";
                }
                else {
                    //to get user uuid and name
                    QuizData.setUser(result);
                    loadQuizData();
                }
            })
            .error(function(err){
                $log.error("error gettint profile",err)
            })
    }
    else if (self.userId!=undefined) {
        $http.get("/quiz/profile/"+self.userId)
            .success(function(result){
                //to get user uuid and name
                QuizData.setUser(result);
                loadQuizData();
            })
            .error(function(err){

            })                
    }
    else {
        loadQuizData();
    }



    self.focusTopic = function(){
        $('#category').focus();
    }

    self.create = function(){
        if (QuizData.getUser()!=null && QuizData.getUser()!="") {
            self.creating = true;    
        }
        else {
            self.registering = true;
        }        
    }

    self.registerEmail = function() {
        localStorage.setItem("emailAddress",self.emailAddress);
        self.registeringNow = true;
        QuizData.registerEmailAddress(self.emailAddress).success(function(result){
            $log.debug("Response from registering: ", result);
            QuizData.showMessage("Registration Successful","Thanks for registering. You will receive an email on how to register. Click OK and let's start creating a quiz",function() {
                self.registering = false;
                self.creating = true;            
                self.registeringNow = false;                    
            })

        }).error(function(err){
            QuizData.showMessage("Registration Error","There seems to be an error with your email address. This is the error we got: "+err,function() {

            });
        });
    }

    self.createQuiz = function(){
        if(self.newQuizName.length == 0)
            self.newQuizName = "Quiz";
        if (self.newQuizCategory.length ==0) {
            self.newQuizCategory = "Root";
        }

        var found = false;
        var rootTopicId = "-1";
        self.newQuizCategory = $("#category").val();
        for (var i in self.rootTopics) {
            if (self.rootTopics[i].name==self.newQuizCategory) {
                //we already have this category
                rootTopicId = self.rootTopics[i].uuid;
                found = true;
                break;
            }
        }
        if (found) {
            localStorage.setItem("rootTopicId",rootTopicId);
        }

        QuizData.addQuiz({name: self.newQuizName, categoryId: rootTopicId, category: self.newQuizCategory, questions: []},function(idx) {
            $location.path("/create/" + idx);
            $log.debug("going to /create/" + idx);
        });
    };

    self.editQuiz = function(quiz){
        var idx = 0;
        for (var i in self.pastQuizzes) {
            if (self.pastQuizzes[i].uuid==quiz.uuid) {
                break;
            }
            idx++;
        }
        $location.path("/create/" + idx);
        $log.debug("Editing quiz " + idx);
    };

    self.previewQuiz = function(idx){

        $location.path("/preview/" + idx);
        $log.debug("Viewing quiz " + idx);
    };

    self.deleteQuiz = function(quiz){
        var idx = 0;
        for (var i in self.pastQuizzes) {
            if (self.pastQuizzes[i].uuid==quiz.uuid) {
                break;
            }
            idx++;
        }
        QuizData.confirmWithUser("Confirm Delete","Are you sure you want to permanently delete this quiz?",function() {
            $location.path("/delete/" + idx);
            $log.debug("Viewing quiz " + idx);
        });
    };

    self.unpublishQuiz = function(idx){
        QuizData.unpublishQuiz(quiz).success(function(result){
            $log.debug("Response from unpublishing: ", result);
            self.pastQuizzes[idx].enabled = false;
        }).error(function(err){
            $log.debug("Error from unpublishing: ", err);
            self.statusText = err;
        });
    };

    self.republishQuiz = function(quiz){
        QuizData.republishQuiz(quiz).success(function(result){
            $log.debug("Response from republishing: ", result);
            self.pastQuizzes[idx].enabled = true;
        }).error(function(err){
            $log.debug("Error from republishing: ", err);
            self.statusText = err;
        });
    };

    self.unassignPublicQuiz = function(quiz) {
        var idx = 0;
        for (var i in self.pastQuizzes) {
            if (self.pastQuizzes[i].uuid==quiz.uuid) {
                break;
            }
            idx++;
        }
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

    //self.editSampleQuiz = function(idx){
    //    var idx = QuizData.addQuiz( self.sampleQuizzes[idx]);
    //    $location.path("/create/" + idx);
    //    $log.debug("Editing quiz (from template) " + idx);
    //};

    $log.debug(self);

}]);
