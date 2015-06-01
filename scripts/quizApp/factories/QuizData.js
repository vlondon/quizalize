var randomise = require('quizApp/utils/randomise');


angular.module('quizApp').factory('QuizData', function($http, $log, $rootScope){
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

    var topicsLoaded = false;

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

    var setClassCode = function(code) {
        classCode = code;
        localStorage.setItem("classCode",classCode);
    }

    var registerWithGroup = function(code,callback) {
        setClassCode(code);
        zzish.registerUserWithGroup(userUuid, classCode, function(err,resp) {
            if (!err) {
                processQuizData(resp,false);
            }
            callback(err, resp);
            $rootScope.$digest();
        })
    }

    var loadPlayerQuizzes = function(callback) {
        if (userUuid && classCode) {
            zzish.listContentForGroup(userUuid,classCode,function(err,resp) {
                if (!err) {
                    processQuizData(resp,false);
                }
                callback(err,resp);
                $rootScope.$digest();
            });
        }
    }

    var processQuizData = function(result,privateMode) {
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
            quiz.publicAssigned = privateMode;
            categories[cuuid].quizzes.push(quiz);
        }
        for (var i in result.categories) {
            topicsLoaded = true;
            topics[result.categories[i].uuid] = result.categories[i];
        }
    }

    var processQuizCategories = function(result) {
        for (var i in result.categories) {
            var category = result.categories[i];
            if (categories[category.uuid]==undefined) {
                categories[category.uuid] = { category: category, quizzes: [], order_index: parseInt(category.index)} ;
            }
        }
        for (var i in result.categories) {
            topicsLoaded = true;
            topics[result.categories[i].uuid] = result.categories[i];
        }
    }

    var selectQuestionType = function(index) {
        var currentQuestion = currentQuiz.questions[index];
        var indexOfSpace = currentQuestion.answer.indexOf(" ");
        var patternToDected = currentQuestion.answer.match(/\$\$[\s\S]+?\$\$|\$[\s\S]+?\$/g);
        var length = currentQuestion.answer.length;
        if((currentQuestion && !!currentQuestion.alternatives) || patternToDected || length ==1 || indexOfSpace>=0 || length ==8) {
            //either there are alternatives or there is a space in the anser
            return "multiple";
        }
        else {
            var options = ["scrambled","multiple"];
            var ran = Math.floor(Math.random()*options.length);
          //return options[ran];
            return "scrambled";
        }
    }

    var initQuizResult = function() {
        currentQuizResult = { quizId: currentQuiz.uuid, totalScore: 0, questionCount: currentQuiz.questions.length, report: [], correct: 0, latexEnabled: !!currentQuiz.latexEnabled };
        localStorage.setItem("currentQuizResult",JSON.stringify(currentQuizResult));
        return currentQuizResult;
    }

    var setQuiz = function(quiz) {
        currentQuiz = quiz;
        localStorage.setItem("currentQuiz",JSON.stringify(currentQuiz));
        quiz.questions = spliceQuestions(quiz)
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

    var randomFunctionNumber = function(seed,size) {
        var x = Math.sin(seed++) * 10000;
        var result =  x - Math.floor(x);
        return Math.floor(result * size) + 1;
    }

    var hashCode = function(str) {
        var hash = 0, i, chr, len;
        if (str.length == 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

    function shuffle(array) {
        if (array.length==1) {
            return array;
        }
        var currentIndex = array.length, temporaryValue, randomIndex ;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    var spliceQuestions = function(quiz) {
        var settings = quiz.settings;
        var questions = quiz.questions;
        var seed = Math.floor((Math.random() * 100) + 1);
        var result = [];
        if (settings && quiz.questions!=undefined && quiz.questions.length>1) {
            if (settings['random']=="false") {
                seed = quiz.updated;
            }
            var result2 = [];
            if (settings['numQuestions']) {
                var random = false;
                try {
                    var num = parseInt(settings['numQuestions']);
                    var numToAdd = Math.min(num,questions.length);
                    for (var i=0;i<numToAdd;i++) {
                        var randomNumber = randomFunctionNumber(seed,questions.length);
                        var x = questions.splice(randomNumber,1);
                        result2.push(x[0]);
                    }
                }
                catch (err) {

                }
            }
            else {
                result2 = questions;
            }
            if (settings['random']=="true") {
                result = shuffle(result2);
            }
            else {
                result = result2;
            }
        }
        else {
            return questions;
        }
        return result;
    }

    var getPublicContent = function(quizId,callback) {
        zzish.getPublicContent(quizId,function (err,message) {
            if (!err) {
                currentQuiz = message;
            }
            setQuiz(message);
            callback(err, message);
            $rootScope.$digest();
        })
    }

    var selectQuiz = function(catId,quizId,isLoaded,callback) {
        if (isLoaded && catId!="public") {
            if (categories[catId]==undefined) {
                loadPlayerQuizzes(function() {
                    searchThroughCategories(catId,quizId,callback);
                })
            }
            else {
                searchThroughCategories(catId,quizId,callback);
            }
        }
        else if (catId.indexOf("share:")==0) {
            zzish.getContent(catId.substring(6),quizId,function (err,result) {
                setQuiz(result);
                callback(err,result);
                $rootScope.$digest();
            });
        }
        else {
            getPublicContent(quizId,callback);
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
        setUser: function (user) {
            setUser(user);
        },
        registerUserWithGroup: function(code,callback) {
            if (code!=undefined) {
                setClassCode(code);
                registerWithGroup(code,callback);
            }
        },
        getCategories: function() {
            return categories;
        },
        getTopics: function(callback) {
            if (!topicsLoaded) {
                zzish.listPublicContent(function(err,data) {
                    if (!err) {
                        processQuizCategories(data);
                    }
                    callback(topics);
                    $rootScope.$digest();
                });
            }
            else {
                return callback(topics);
            }
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
                    $rootScope.$digest();
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
                    processQuizData(message,true);
                }
                callback(err, message);
                $rootScope.$digest();
            });
        },
        loadQuiz: function(catId,quizId,callback) {
            if (currentQuiz!=undefined && currentQuiz.uuid==quizId) {
                callback(currentQuiz);
            }
            else {
                //we have a problem
                var loaded = true;
                if (catId=="public" || catId.indexOf("share:")==0) {
                    loaded = false;
                }
                selectQuiz(catId,quizId,loaded,callback);
            }
        },
        selectQuiz: function(catId,quizId,isLoaded,callback) {
            selectQuiz(catId,quizId,isLoaded,callback);
        },
        previewQuiz: function(quizId,callback) {
            var quizData = JSON.parse(localStorage.getItem("quizData"));
            if (quizData!=undefined) {
                var quiz = quizData[quizId];
                setQuiz(quiz);
                callback(quiz);
            }
            else {

            }
        },
        selectQuestionType: function(index) {
            return selectQuestionType(index);
        },
        currentQuiz: function() {
            return currentQuiz;
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
                if (callback!=undefined){
                    callback(err, message);
                    $rootScope.$digest();
                }
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
            if(question.alternatives && question.alternatives.length>0){
                var options = [];
                options.push(question.answer);
                for(var i in question.alternatives) {
                    var alt = question.alternatives[i];
                    if (alt!=undefined && alt.length>0) {
                        options.push(alt);
                    }
                }
                return randomise(options);
                //return options;
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
                var options = randomise(answers).slice(0,3);
                options.push(correct);
                return options;
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
                extensions: {},
                attributes: {}
            }
            if (question.topicId) {
                parameters.extensions["categoryId"] = question.topicId;
            }
            if (question.imageURL) {
                parameters.attributes["image_url"] = question.imageURL;
            }
            zzish.logActionWithObjects(currentQuizResult.currentActivityId, parameters);

            if(correct) {
                currentQuizResult.correct++;
                currentQuizResult.totalScore += score;
            }

            var reportItem = {
                id: idx,
                question: questionName,
                questionId: question.uuid,
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
                if (currentQuizResult.currentActivityId!=undefined) {
                    zzish.stopActivity(currentQuizResult.currentActivityId,{});
                }
                return '/quiz/' +  currentQuiz.categoryId + "/" + currentQuiz.uuid + "/complete";
            }
            else {
                return '/quiz/' +  currentQuiz.categoryId + "/" + currentQuiz.uuid + "/" + selectQuestionType(q) + '/' + (q);
            }
        },
        cancelCurrentQuiz: function(callback) {
            if (currentQuizResult.currentActivityId!=undefined) {
                zzish.cancelActivity(currentQuizResult.currentActivityId,function(err,message) {
                    initQuizResult();
                    if (callback!=undefined){
                        callback(err,message);
                        $rootScope.$digest();
                    }
                })
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
});
