
angular.module('createQuizApp').factory('QuizData', ['$http', '$log', function($http, $log){
    // setup/add helper methods, variables...

    var userUuid = localStorage.getItem("userId");
    var userVerified = localStorage.getItem("userVerified")=="true";
    var savingQuiz = false;

    //Initialise User
    var data = localStorage.getItem("quizData");
    data = JSON.parse(data);

    if(!data){
        data = [];
    }

    var timesQuiz = [];

    for(var i=1; i<12; i+=2){
        for(var j=2; j<13; j+=2){
            timesQuiz.push({question: "What is " + i + " times " + j + "?",
                            answer: String(i * j)});
        }
    }

    timesQuiz = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }(timesQuiz);

    //currently is cities and times quizes
    var sampleData = require('createQuizApp/data/sampleData');

    function createUserId(callback) {
        if(!userUuid) {
            userUuid = uuid.v4();
            localStorage.setItem("userId", userUuid);
            localStorage.setItem("userVerified", false);

            $http.post("/create/profile", {uuid: userUuid})
                .success(function(result){
                    callback(null,result);
                    $log.debug("Got result from profile", result);
                })
                .error(function(err){
                    callback(err);
                    $log.error("Error when registering profile", err);
            });
        }
        else {
            callback(null,userUuid);
        }
    }

    var postDelete = function(quiz){
        $log.debug(quiz);
        return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/delete", quiz);
    };


    var postQuiz = function(quiz){
        $log.debug(quiz);
        return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid, quiz);
    };

    var getQuizzes = function(){
        return $http.get("/create/" + userUuid + "/quizzes/");
    };

    var getQuiz = function(uuid){
        return $http.get("/create/" + userUuid + "/quizzes/" + uuid);
    };

    var getTopics = function(){
        return $http.get("/create/" + userUuid + "/topics/");
    };

    var postTopic = function(topic){
        return $http.post("/create/" + userUuid + "/topics/", topic);
    };


    return{
        getSampleQuizzes: function(callback){
            callback(sampleData);
        },
        getQuizzes: function(callback){
            if (userUuid!="") {
                getQuizzes().success(
                    function(resp){
                        $log.debug(resp);
                        data = resp;
                        callback(data);
                    }
                );
            }
        },
        getTopics: function( callback){
            getTopics().success(function(resp){
                $log.debug("Response from server for getting topics", resp);
                callback(resp);
            }).error(function(er){
                $log.debug("Error from server when getting topics`", er);
            });
        },
        getQuiz: function(id, loadFromServer, callback){
            if(typeof data[id] != 'undefined'){
                if(typeof data[id].questions != 'undefined'){
                    $log.debug("Questions local");
                    callback(data[id]);
                }else{
                    if (loadFromServer) {
                        $log.debug("No questions, so fetching from server");
                        getQuiz(data[id].uuid).success(function(resp){
                            $log.debug("Response from server for getting a quiz", resp);
                            callback(resp);
                        }).error(function(er){
                            $log.debug("Error from server when getting quiz", er);
                        });
                    }
                    else {
                        $log.debug("No questions, not loading from server");
                        callback({uuid: data[id].uuid});
                    }
                }
            }
        },
        deleteQuiz: function(id,callback){
            var quiz = data[id];
            data.splice(id,1);
            $log.debug("Removing Quiz: ", data);
            localStorage.setItem("quizData", JSON.stringify(data));
            postDelete(quiz).success(function(result){
                callback();
            });

        },
        saveQuiz: function(id, quiz,topics){
            data[id] = quiz;
            $log.debug("Saving Quiz: ", data);
            localStorage.setItem("quizData", JSON.stringify(data));

            for (i in topics) {
                if (topics[i].newObject!=undefined && topics[i].newObject) {
                    topics[i].newObject = null;
                    postTopic(topics[i]).success(function(resp){
                        $log.debug("Returning from post topic");
                    });
                }
            }
            localStorage.setItem("topics", JSON.stringify(topics));
            if (!savingQuiz) {
                $log.debug("About to post");
                savingQuiz = true;
                postQuiz(quiz).success(function(resp){
                    $log.debug("Returning from post");
                    savingQuiz = false;
                }).error(function(er){
                    $log.debug("Returning from post");
                    savingQuiz = false;
                });
            }
        },
        addQuiz: function(quiz, callback){
            //hide loginButton as you can no longer login if you haven't already done so
	        var email = localStorage.getItem("emailAddress");
            if (!userVerified && email==null) {
                $("#LoginButton").hide();
            }
            else if (email!=null) {
                $("#LoginButton").html("Logout");
            }
            if(!data) data = []; //yes it will replace [] with [].
            //get UserId (creates on if it doesn't already exist);
            createUserId(function(err,message) {
                if (quiz.categoryId=="-1") {
                    //we don't have the root category, so we need to create
                    //need to add the category
                    rootTopicId = uuid.v4();
                    postTopic({ name: quiz.category, parentCategoryId: "-1", uuid: rootTopicId, subContent: false})
                    localStorage.setItem("rootTopicId",rootTopicId);
                    quiz.categoryId = rootTopicId;
                }
                if (quiz.uuid==undefined) {
                    quiz.uuid = uuid.v4();
                }
                data.push(quiz);
                $log.debug("Saving (addQuiz): ", data);
                localStorage.setItem("quizData", JSON.stringify(data));
                callback(data.length -1);
            });
        },
        publishQuiz: function(quiz, details){
            $log.debug("Publish Quiz", quiz, details);
            return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/publish", details);
        },
        getClassCode: function(){
            return localStorage.getItem("classCode");
        },
        saveClassCode: function(newClassCode){
            if(newClassCode)
                localStorage.setItem("classCode", newClassCode);
        },
        setUser: function (user) {
            userUuid = user.uuid;
            localStorage.setItem("userId",userUuid);
	    var email = localStorage.getItem("emailAddress");
            if (user.verified!=undefined) {
                userVerified = user.verified;
            }
            else {
                userVerified = false;
            }
            localStorage.setItem("userVerified",userVerified);
            if (userVerified || email!=null) {
                $("#LoginButton").html("Logout");
		$("#LoginButton").show();
            }
            else {
                //just hide it, as this seems to be an anonymous user
                //$("#LoginButton").hide();
            }
            if (user.code!=undefined) {
                localStorage.setItem("classCode",user.code);
            }
        }
    };
}]);
