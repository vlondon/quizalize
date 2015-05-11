var randomise = require('quizApp/utils/randomise');


angular.module('quizApp').factory('QuizData', ['$http', '$log', '$location', function($http, $log, $location){
    if(typeof zzish == 'undefined') $log.error("Require zzish.js to use zzish");
    var settings = require('quizApp/config/settings');

    zzish.init(initToken);

    var userUuid = localStorage.getItem("userId");
    var userName =  localStorage.getItem("userName");
    zzish.getUser(userUuid,userName);
    
    var classCode = localStorage.getItem("classCode");
    var categories = {};
    var contents = {};
    var topics = {};
    var currentQuiz = JSON.parse(localStorage.getItem("currentQuiz"));

    var currentQuizResult = JSON.parse(localStorage.getItem("currentQuizResult"));

    var maxTime = settings.maxTime;
    var maxScore = settings.maxScore;
    var minScore = settings.minScore;
    var gracePeriod = settings.gracePeriod;

    //callbacks for messaging
    var callbacks = {};

    var setUser = function(user) {
        if (user==undefined) {
            userUuid = "";    
            localStorage.clear();
        }
        else {
            userUuid = user.uuid;
            userName = user.name;
            localStorage.setItem("userId",userUuid);
            localStorage.setItem("userName",userName);
        }        
    }

    var registerWithGroup = function(code,callback) {
        classCode = code;
        localStorage.setItem("classCode",classCode);
        zzish.registerUserWithGroup(userUuid,classCode,function(err,resp) {
            if (!err) {
                processQuizData(resp);
            }
            callback(err,resp);
        })        
    }

    var loadPlayerQuizzes = function(callback) {
        if (userUuid && classCode) {
            zzish.listContentForGroup(userUuid,classCode,function(err,resp) {
                if (!err) {
                    processQuizData(resp);
                }
                callback(err,resp);
            });
        }        
    }

    var processQuizData = function(result) {
        categories = {};
        topics = {};
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
        }
        for (var i in result.categories) {
            topics[result.categories[i].uuid] = result.categories[i];
        }
    }

    var selectQuestionType = function(index) {
        var currentQuestion = currentQuiz.questions[index];
        var indexOfSpace = currentQuestion.answer.indexOf(" ");
        if((currentQuestion && !!currentQuestion.alternatives) || indexOfSpace>=0) {
            //either there are alternatives or there is a space in the anser
            return "multiple";
        }
        else {
            return "scrambled";
        }
    }

    var initQuizResult = function() {
        currentQuizResult = { quizId: currentQuiz.uuid, totalScore: 0, questionCount: currentQuiz.questions.length, report: [], correct: 0 };
        localStorage.setItem("currentQuizResult",JSON.stringify(currentQuizResult));
        return currentQuizResult;
    }

    var setQuiz = function(quiz) {
        currentQuiz = quiz;        
        localStorage.setItem("currentQuiz",JSON.stringify(currentQuiz));
        initQuizResult();
    }

    var searchThroughCategories= function(catId,quizId,callback) {
        for (var i in categories[catId].quizzes) {
            var quiz = categories[catId].quizzes[i];
            if (quiz.uuid==quizId) {
                setQuiz(quiz);
                callback(null,currentQuiz);
            }
        }         
    }

    var getPublicContent = function(quizId,callback) {
        zzish.getPublicContent(quizId,function (err,message) {
            if (!err) {
                currentQuiz = message;                        
            }
            setQuiz(message);
            callback(err,message);
        })        
    }

    var selectQuiz = function(catId,quizId,isLoaded,callback) {
        if (isLoaded) {
            if (categories[catId]==undefined) {
                loadPlayerQuizzes(function() {
                    searchThroughCategories(catId,quizId,callback);
                })
            }            
            else {
                searchThroughCategories(catId,quizId,callback);               
            }
        }
        else {
            if (categories[catId]==undefined) {
                zzish.listPublicContent(function(err, message){
                    if(!err) {
                        processQuizData(message);
                        getPublicContent(quizId,callback);
                    }
                });
            }
            else {
                getPublicContent(quizId,callback);
            }
        }        
    }

    var calculateScore = function(correct, duration){
        //Something a bit like (below not clear... probably meant 20000 etc), will go with 100 as max... can obviously easily change this
        //P2:  Add 20 second timer and have max 200 points scored per
        // question =  max (  0.1*(min(2000-time_in_milis,0),  if(correct, 50,0)).
        // To do this ideally should have a "Next" button that comes up after answering
        // each question and a 3, 2, 1 countdown page before showing the next question.
        //

        if(correct){
            return Math.max(minScore, Math.min(Math.round((maxTime + gracePeriod - duration)/(maxTime/maxScore)), maxScore));
        }else{
            return 0;
        }
    };    

    //return client data api
    return {
        //User methods
        isLoggedIn: function() {
            return userUuid && userUuid.length>0 && classCode && classCode.length>0;
        },
        unsetUser: function() {
            var result = userUuid!="" && userUuid!=undefined;
            setUser(null);
            var token = localStorage.getItem("token");
            if (token!=null) {
                zzish.logout(token);
            }            
            return result;
        },
        getUser: function () {
            return userUuid;
        },
        getUsername: function() {
            return userName;
        },
        getClassCode: function() {
            return classCode;
        },        
        setUser: function (user,code) {
            setUser(user);
        },
        getCategories: function() {
            return categories;
        },
        getTopics: function() {
            return topics;
        },
        loginUser: function(user,classcode,callback) {
            if (zzish.validateClassCode(classcode)) {
                var newId = uuid.v4();
                zzish.authUser(newId,user,classcode,function(err,message) {
                    if (!err) {
                        setUser(message);
                        registerWithGroup(classcode,callback);
                    }
                    else {
                        callback(err,message);
                    }
                });                

            }
            else {
                callback(404,"Check your classcode");
            }
        },        
        loadPlayerQuizzes: function(callback) {
            loadPlayerQuizzes(callback);
        },     
        loadPublicQuizzes: function(callback){
            zzish.listPublicContent(function(err, message){
                if(!err) {
                    processQuizData(message);
                }
                callback(err, message);
            });
        },
        loadQuiz: function(catId,quizId,callback) {
            if (currentQuiz!=undefined && currentQuiz.categoryId==catId && currentQuiz.uuid==quizId) {
                callback(currentQuiz);
            }
            else {
                //we have a problem
                selectQuiz(catId,quizId,action,callback);
            }
        },     
        selectQuiz: function(catId,quizId,isLoaded,callback) {
            selectQuiz(catId,quizId,isLoaded,callback);
        },        
        selectQuestionType: function(index) {
            return selectQuestionType(index);
        },
        startCurrentQuiz: function(callback) {
            var parameters = {
                activityDefinition: {
                    type: currentQuiz.uuid,
                    name: currentQuiz.name,
                    score: settings.maxScore * currentQuiz.questions.length,
                    count: currentQuiz.questions.length,
                    duration: ""+ currentQuiz.questions.length * settings.maxTime,
                },
                extensions: {
                    contentId: currentQuiz.uuid,
                    groupCode: classCode
                }
            }
            if (currentQuiz.categoryId) {
                parameters.extensions.categoryId = currentQuiz.categoryId;
            }
            if (currentQuiz.publicAssigned==true && userUuid==null) {
                userUuid = uuid.v4();
            }
            currentQuizResult.currentActivityId = zzish.startActivityWithObjects(userUuid,parameters, function(err, message){                
                if (callback!=undefined) callback(err, message);
            });
        },
        currentQuizResult: function() {
            if (currentQuizResult.quizId==currentQuiz.uuid) {
                return currentQuizResult;
            }
            return initQuizResult(currentQuiz);
        },
        getQuestion: function(questionIndex,callback) {
            callback(currentQuiz.questions[questionIndex]);
        },
        getAlternatives: function(questionIndex){
            var question = currentQuiz.questions[questionIndex];
            if(question.alternatives){
                var options = [];
                options.push(question.answer);
                for(var i in question.alternatives) {
                    var alt = question.alternatives[i];
                    if (alt!=undefined && alt.length>0) {
                        options.push(alt);
                    }
                }
                return randomise(options);

            } else {
                var answers = [];
                var correct = question.answer;

                for(var i in currentQuiz.questions){                    
                    var q = currentQuiz.questions[i];
                    if (q.question!=question.question) {
                        if(q.answer != correct){
                            answers.push(q.answer);
                        }                        
                    }
                }
                var options = answers.slice(0,3);
                options.push(correct);
                return randomise(options);
            }
        },
        answerQuestion: function(idx, response, answer, questionName, duration){
            var question = currentQuiz.questions[idx];

            var correct = (response.toUpperCase().replace(/\s/g, "") == answer.toUpperCase().replace(/\s/g, ""));
            var score = calculateScore(correct, duration);

            var parameters = {
                definition: {
                    type: question.uuid,
                    name: question.question,
                    score: maxScore,
                    duration: maxTime,
                    response: question.answer
                },
                result: {
                    score: score,
                    correct: correct,
                    attempts: 1,
                    response: response,
                    duration: duration
                },
                extensions: {}
            }
            if (question.topicId) {
                parameters.extensions["categoryId"] = question.topicId;
            }
            zzish.logActionWithObjects(currentQuizResult.currentActivityId, parameters);

            if(correct) {
                currentQuizResult.correct++;
                currentQuizResult.totalScore += score;
            }

            var reportItem = {
                id: idx,
                question: questionName,
                response: response,
                answer: answer,
                correct: correct,
                score: score,
                roundedScore: Math.round(score),
                seconds: Math.ceil(duration/1000),
                topicId: question.topicId,
                duration: duration
            };
            currentQuizResult.report.push(reportItem);
            localStorage.setItem("currentQuizResult",JSON.stringify(currentQuizResult));
        },
        generateNextQuestionUrl: function(questionId) {
            var q = questionId + 1;
            if (currentQuiz.questions.length==q) {
                return '/quiz/' +  currentQuiz.categoryId + "/" + currentQuiz.uuid + "/complete";
            }
            else {
                return '/quiz/' +  currentQuiz.categoryId + "/" + currentQuiz.uuid + selectQuestionType(q) + '/' + (q);
            }
        },
        cancelCurrentQuiz: function(callback) {
            zzish.cancelActivity(currentQuizResult.currentActivityId,function(err,message) {
                if (callback!=undefined) callback(err,message);
            })
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
