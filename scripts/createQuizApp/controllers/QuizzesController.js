angular.module('createQuizApp').controller('QuizzesController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    self.newQuizName = "";
    self.newQuizCategory = "";
    self.rootTopicList = [];
    self.rootTopics = [];

    if(typeof ($location.search()).name != 'undefined'){
        //Have quiz name
        self.newQuizName = $location.search().name;
        self.didSupplyQuizName = true;
        //$location.search({});
    }else if(typeof ($location.search()).sample != 'undefined') {
        //Have sample quiz
        self.sampleName = $location.search().sample;
        self.didRequestSample = true;
    }
    else if(typeof ($location.search()).token != 'undefined'){
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
                    QuizData.getTopics(function(topics){
                        if (topics) {
                            for (var i in topics) {
                                if (topics[i].parentCategoryId=="-1") {
                                    self.rootTopics.push(topics[i]);
                                    self.rootTopicList.push(topics[i].name);
                                }
                            }
                            $( "#category" ).autocomplete({
                                source: self.rootTopicList
                            });
                        }
                    });
                    QuizData.getQuizzes(function(data){
                        self.pastQuizzes = data;

                        if(self.didSupplyQuizName){
                            $log.debug("Should create Quiz, with name", self.newQuizName);
                           self.createQuiz();
                        }
                    });

                }
            })
            .error(function(err){
                $log.error("error gettint profile",err)
            })
    }
    else if (self.userId!=undefined) {
        QuizData.getTopics(function(topics){
            if (topics) {
                for (var i in topics) {
                    if (topics[i].parentCategoryId=="-1") {
                        self.rootTopics.push(topics[i]);
                        self.rootTopicList.push(topics[i].name);
                    }
                }
                $( "#category" ).autocomplete({
                    source: self.rootTopicList
                });
            }
        });
        $http.get("/quiz/profile/"+self.userId)
            .success(function(result){
                //to get user uuid and name
                QuizData.setUser(result);
                QuizData.getQuizzes(function(data){
                    self.pastQuizzes = data;

                    if(self.didSupplyQuizName){
                        $log.debug("Should create Quiz, with name", self.newQuizName);
                       self.createQuiz();
                    }
                });
            })
            .error(function(err){

            })
    }
    else {
        QuizData.getTopics(function(topics){
            if (topics) {
                for (var i in topics) {
                    if (topics[i].parentCategoryId=="-1") {
                        self.rootTopics.push(topics[i]);
                        self.rootTopicList.push(topics[i].name);
                    }
                }
                $( "#category" ).autocomplete({
                    source: self.rootTopicList
                });
            }
        });
        QuizData.getQuizzes(function(data){
            self.pastQuizzes = data;

            if(self.didSupplyQuizName){
                $log.debug("Should create Quiz, with name", self.newQuizName);
               self.createQuiz();
            }

            if(self.didRequestSample){
                $log.debug("Should create sample Quiz", self.sampleName);
                // QuizData.getSampleQuizzes(function(data){
                //     var sampleQuizzes = data;

                //     if(typeof sampleQuizzes[self.sampleName] != 'undefined'){
                //         QuizData.addQuiz(sampleQuizzes[self.sampleName], function(idx) {
                //             QuizData.saveQuiz(idx, sampleQuizzes[self.sampleName]);
                //             $location.path("/preview/" + idx);
                //             // $location.path("/create/" + idx);
                //             $log.debug("going to /preview/" + idx);
                //         });
                //     }else{
                //         $log.error("Tried to create sample quiz which didn't exist");
                //     }
                // });
                QuizData.addQuiz({uuid:self.sampleName}, function(idx) {
                    $location.path("/preview/" + idx);
                    // $location.path("/create/" + idx);
                    $log.debug("going to /preview/" + idx);
                });
            }
        });
    }

    self.focusTopic = function(){
        $('#category').focus();
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

    self.editQuiz = function(idx){
        $location.path("/create/" + idx);
        $log.debug("Editing quiz " + idx);
    };

    self.previewQuiz = function(idx){
        $location.path("/preview/" + idx);
        $log.debug("Viewing quiz " + idx);
    };

    self.deleteQuiz = function(idx){
        if (confirm("Are you sure you want to permanently delete this quiz?")) {
            $location.path("/delete/" + idx);
            $log.debug("Viewing quiz " + idx);
        }

    };
    //self.editSampleQuiz = function(idx){
    //    var idx = QuizData.addQuiz( self.sampleQuizzes[idx]);
    //    $location.path("/create/" + idx);
    //    $log.debug("Editing quiz (from template) " + idx);
    //};

    $log.debug(self);

}]);
