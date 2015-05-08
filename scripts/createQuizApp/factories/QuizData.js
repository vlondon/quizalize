
angular.module('createQuizApp').factory('QuizData', ['$http', '$log', function($http, $log){

    var uuid = require('node-uuid');
    // setup/add helper methods, variables...

    var userUuid = localStorage.getItem("userId");
    var userVerified = localStorage.getItem("userVerified")=="true";
    var savingQuiz = false;
    var callbacks = {};

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

    var getPublicQuizzes = function() {
        return $http.get("/quizzes/" + userUuid + "/public");
    }

    var getPublicAssignedQuizzes = function() {
        return $http.get("/quizzes/" + userUuid + "/public/" + localStorage.getItem("classCode") + "/assigned");    
    }

    var processQuizList = function(result,callback){
        self.quizzes = [];
        self.categories = [];
        var categories = {};
        for (var i in result.contents) {
            var quiz = result.contents[i];
            var cuuid = "undefined";
            var category = { name: "Other" };
            if (quiz.categoryId!=undefined) {
                cuuid = quiz.categoryId;
                if (result.categories!=undefined) {
                    for (var i in result.categories) {
                        if (result.categories[i].uuid==quiz.categoryId) {
                            category = result.categories[i];
                        }
                    }
                }
            }
            if (categories[cuuid]==undefined) {
                categories[cuuid] = { category: category, quizzes: [], order_index: parseInt(category.index)} ;
            }
            categories[cuuid].quizzes.push(quiz);
            if (category.name=="") {
                category.homework = true;
            }
            if (category.homework) {
                category.name="Quizzes (" + categories[cuuid].quizzes.length + ")";
            }
            self.quizzes.push(quiz);
        }
        for (var i in categories) {
            self.categories.push(categories[i]);
        }
        callback();
    };    


    return{
        getSampleQuizzes: function(callback){
            callback(sampleData);
        },
        getQuizzes: function(callback){
            if (userUuid!="") {
                getQuizzes().success(
                    function(resp){
                        for (i in resp) {
                            resp[i].publicAssigned = false;
                        }
                        data = resp;
                        if (localStorage.getItem('classCode')!=null) {
                            getPublicAssignedQuizzes().success(
                                function(resp) {
                                    for (i in resp) {
                                        resp[i].publicAssigned = true;
                                        data.push(resp[i]);
                                    }
                                    callback(data);
                                }
                            );                                                    
                        }
                        else {
                            callback(data);
                        }
                    }
                );
            }
        },
        getPublicAssignedQuizzes: function(callback) {
            if (userUuid!="" && localStorage.getItem('classCode')!=null) {
                if (localStorage.getItem("classCode")==undefined) {
                    callback({});
                }
                else {
                    getPublicAssignedQuizzes().success(function(resp){
                        callback(resp);    
                    }).error(function(er){
                        $log.debug("Error ", er);
                    });                
                }
            }
        },           
        getPublicQuizzes: function(callback){
            getPublicQuizzes().success(function(resp){
                $log.debug("Response from server for getting public quizzes", resp);
                processQuizList(resp,function() {
                    callback(resp);    
                });                
            }).error(function(er){
                $log.debug("Error from server when getting public quizzes`", er);
            });
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
                if(typeof data[id].questions != 'undefined' || data[id].publicAssigned){
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
        getCategories: function() {
            return self.categories;
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

            for (var i in topics) {
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
            if(!data) data = []; //yes it will replace [] with [].
            //get UserId (creates on if it doesn't already exist);
            createUserId(function(err,message) {
                if (quiz.categoryId=="-1") {
                    //we don't have the root category, so we need to create
                    //need to add the category
                    var rootTopicId = uuid.v4();
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
        unassignAssignQuiz: function(id){
            return $http.post("/quizzes/" + userUuid + "/public/" + localStorage.getItem("classCode") + "/" + id + "/delete");    
        },         
        registerEmailAddress: function(email) {
            return $http.post("/quizzes/register", {emailAddress: email});
        },
        publishQuiz: function(quiz, details){
            $log.debug("Publish Quiz", quiz, details);
            return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/publish", details);
        },
        republishQuiz: function(quiz, details){
            $log.debug("RePublish Quiz", quiz, details);
            return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/" + localStorage.getItem("classCode") +"/republish", details);
        },
        unpublishQuiz: function(quiz, details){
            $log.debug("UnPublish Quiz", quiz, details);
            return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/" + localStorage.getItem("classCode") + "/unpublish", details);
        },        
        getClassCode: function(){
            return localStorage.getItem("classCode");
        },
        saveClassCode: function(newClassCode){
            if(newClassCode)
                localStorage.setItem("classCode", newClassCode);
        },
        getUser: function () {
            return userUuid;
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
        },
        showMessage : function(title,message,callBack) {
            
            if (callBack!=null) {
                var uuidGen = uuid.v4();    
                $("#modalUuid").val(uuidGen);
                callbacks[uuidGen]=callBack;
            }
            else {
                $("#modalUuid").val("");
            }
            $("#modalTitle").html(title);
            $("#closeButton").hide();
            $("#modalMessage").html(message);
            $("#closeButton").html("OK");
            $("#messageButton").click();                
        },
        confirmWithUser : function(title,message,callBack) {
            var uuidGen = uuid.v4();
            $("#modalUuid").val(uuidGen);
            callbacks[uuidGen]=callBack;
            $("#modalTitle").html(title);
            $("#closeButton").show();
            $("#modalMessage").html(message);
            $("#closeButton").html("No");
            $("#confirmButton").html("Yes");            
            $("#messageButton").click();                
        },
        confirmed: function(uuid) {
            if (uuid!=undefined && uuid!="" && callbacks[uuid]!=undefined) {
                var x = callbacks[uuid];
                delete callbacks[uuid];
                x();
            }
        }     
    };
}]);
