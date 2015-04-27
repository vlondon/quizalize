var randomise = require('quizApp/utils/randomise');

angular.module('quizApp')
.factory('QuizData', ['$http', '$log', '$location', 'ZzishContent', function($http, $log, $location, ZzishContent){

    var uuid = require('node-uuid');
    var settings = require('quizApp/config/settings');

    var maxTime = settings.maxTime;
    var maxScore = settings.maxScore;
    var minScore = settings.minScore;
    var gracePeriod = settings.gracePeriod;

    // setup/add helper methods...
    var quizzes = [];
    var categories = [];
    var topics = {};
    var classCode, studentCode, currentQuiz;
    var currentQuizData = {correct: 0,
            questionCount: 0, totalScore: 0, name: "", report: []};

    var userProfileId = "";

    var chooseKind = function(qId){
        var randomKind = function(){
            var kinds = ['scrambled'];
            return kinds[Math.floor(Math.random()*kinds.length)];
        };

        var isIntegerAnswer = function(ans){
            return !!ans.match(/^-?\d+$/);
        };

        var generateIntegerAlternatives = function(ans){
            var ai = parseInt(ans);
            return ["" + ai + 2, "" + ai - 2, "" + (ai - 1)];
        };

        if(typeof qId != 'undefined') {
            var question = currentQuiz.questions[qId];
	    if (!question) return randomKind();
	    var indexOfSpace = question.answer.indexOf(" ");
            //Always do multiple choice if alternatives
            if((question && !!question.alternatives) || indexOfSpace>=0)
                return 'multiple';

            //If integer do multiple choice (generate alternatives if not there already).
            if(question && isIntegerAnswer(question.answer)){
                if(!question.alternatives)
                    question.alternatives = generateIntegerAlternatives(question.answer);
                return 'multiple';
            }


            //If length 1 (and not alternatives) should always do scrambled... (as won't have alternatives)
            if(currentQuiz.questions.length == 1)
                return 'scrambled';

            //If the answer length is long then do multiple choice (shouldn't have to type/input)
            if(question && question.answer.length > 9){
                return 'multiple';
            }else{
                return randomKind();
            }
        }else{
            return randomKind();
        }
    };
    /**
     *
     * @param result An object with a code and array of contents (in this case quizzes)
     * @param isClassCode This will either be processing results with a class code (if the student has used student code)
     * or student code (if the student used a class code)..
     */
    var processQuizList = function(result, isClassCode){
        if(isClassCode){
            self.classCode = result.code;
        }else{
            self.studentCode = result.code;
        }
        quizzes = [];
        categories = [];
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
            $log.debug("Order",quiz.order);
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
            quizzes.push(quiz);
        }
        for (var i in result.categories) {
            topics[result.categories[i].uuid] = result.categories[i];
        }
        for (var i in categories) {
            categories.push(categories[i]);
        }
        $log.debug("Have processed. Have quizzes:", quizzes, "classCode:", classCode, "studentCode:", studentCode, "Processed from:", result);
    };

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
        login: function(newStudentCode, callback){
            ZzishContent.init(initToken);
            ZzishContent.login(newStudentCode, function(err, message){
                if(!err) {
                    processQuizList(message, true);
                }else{
                    $log.debug("Error with user login:", err);
                }
                callback(err, message);
            });
        },
        getPublicQuizzes: function(callback){
            ZzishContent.init(initToken);
            ZzishContent.getPublicQuizzes(function(err, message){
                if(!err) {
                    processQuizList(message, true);
                }else{
                    $log.debug("Error with user login:", err);
                }
                callback(err, message);
            });
        },
        logout: function(){
            classCode = undefined;
            studentCode = undefined;
            if (userProfileId=="") {
                var studentName = localStorage.getItem("zname");
                var userProfileId = localStorage.getItem("zprofileId"+studentName);
            }
            ZzishContent.logout(userProfileId,function (err,message) {
                userProfileId = "";
                //TODO other logout things?
                localStorage.clear();
                $location.path("/");
            });
        },
        validate: function(newClassCode) {
            return ZzishContent.validate(newClassCode);
        },
        register: function(studentName, newClassCode, callback) {
            classCode = newClassCode.toLowerCase();
            ZzishContent.init(initToken);
            var userProfileId = localStorage.getItem("zprofileId"+studentName);
            if (userProfileId==undefined || userProfileId=="") {
                userProfileId = uuid.v4();
                localStorage.setItem("zprofileId"+studentName,userProfileId);
            }
            ZzishContent.user(userProfileId, studentName, classCode, function(err, message){
                if(!err) {
                    userProfileId = message.uuid;
                    ZzishContent.register(userProfileId, classCode, function(err2, message2){
                        if(!err2 && err2!=404) processQuizList(message2, false);
                        callback(err2, message2);
                    });
                }else{
                    $log.debug("Error with user registration");
                    callback(err, message);
                }
            });
        },
        getQuizzes: function(){
            return quizzes;
        },
        getCategories: function(){
            return categories;
        },
        getTopics: function(){
            return topics;
        },
        selectQuiz: function(categoryId,quizId,callback) {
            ZzishContent.init(initToken);
            var found = false;
            if (categories[categoryId]!=null) {
                var category = categories[categoryId];
                for (var i in category.quizzes) {
                    var quiz = category.quizzes[i];
                    if (quiz.uuid==quizId) {
                        $log.debug("Found quiz", quiz);
                        found = true;
                        ZzishContent.getConsumerContent(quizId,function(err,message) {
                            currentQuiz = message;
                            currentQuiz.questions = message.questions;
                            currentQuizData.totalScore = 0;
                            currentQuizData.questionCount = currentQuiz.questions.length;
                            currentQuizData.correct = 0;
                            currentQuizData.name = currentQuiz.name;
                            currentQuizData.report = [];
                            ZzishContent.startActivity(currentQuiz, function(err, resp){
                                $log.debug("Got response from start activity:", resp);
                            });
                            callback();
                        })
                    }
                }
            }
            if (!found) {
                //$log.error("Selecting an invalid quiz", "Have quizzes", categories);
                ZzishContent.getConsumerContent(quizId,function(err,message) {
                    currentQuiz = message;
                    currentQuiz.questions = message.questions;
                    currentQuizData.totalScore = 0;
                    currentQuizData.questionCount = currentQuiz.questions.length;
                    currentQuizData.correct = 0;
                    currentQuizData.name = currentQuiz.name;
                    currentQuizData.report = [];
                    ZzishContent.startActivity(currentQuiz, function(err, resp){
                        $log.debug("Got response from start activity:", resp);
                    });
                    callback();
                });
            }

        },
        getQuestion: function(id, questionCallback){
            if(typeof currentQuiz != 'undefined') {
                if(id < currentQuiz.questions.length) {
                    questionCallback(currentQuiz.questions[id]);
                }else{
                    $log.debug("Quiz complete", "Getting question", id, "from", currentQuiz);
                    $location.path("/quiz/complete");
                    ZzishContent.stopActivity();
                }
            }else{
                $log.error("Trying to get quiz without having selected one");
                return null;
            }
        },
        chooseKind: function(qId){
            return chooseKind(qId);
        },
        getAlternatives: function(id){
            $log.debug("Generating Alternatives for ", id, "from", currentQuiz);

            if(currentQuiz.questions[id].alternatives){
                var options = [];
                options.push(currentQuiz.questions[id].answer);
                for(var i in currentQuiz.questions[id].alternatives){
                    var alt = currentQuiz.questions[id].alternatives[i];
		    if (alt!=undefined && alt.length>0)
                    	options.push(alt);
                }
                return randomise(options);

            }else{
                var answers = [];
                var correct = currentQuiz.questions[id].answer;

                for(var i in currentQuiz.questions){
                    var q = currentQuiz.questions[i];
                    if(q.answer != correct){
                        answers.push(q.answer);
                    }
                }
                var options = randomise(answers).slice(0,3);
                options.push(correct);
                return randomise(options);
            }
        },
        getStudentData: function(){
            if (classCode==undefined) {
                classCode = localStorage.getItem("zcode");
            }
            if (studentCode ==undefined) {
                studentCode =    localStorage.getItem("zname");
            }
            return {classCode: classCode, studentCode: studentCode};
        },
        currentQuizData: currentQuizData,
        answerQuestion: function(idx, response, answer, questionName, duration){
            $log.debug("Answer question", response, answer, duration);

            var question = currentQuiz.questions[idx];

            var correct = (response.toUpperCase().replace(/\s/g, "") == answer.toUpperCase().replace(/\s/g, ""));
            var score = calculateScore(correct, duration);

            ZzishContent.saveAction(question, {
                score: score,
                correct: correct,
                attempts: 1,
                response: response,
                duration: duration
            });

            if(correct) {
                currentQuizData.correct++;
                currentQuizData.totalScore += score;
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

            currentQuizData.report.push(reportItem);
            $log.debug("Adding report item:", reportItem);

            $location.path("/quiz/answer/" + idx);
        }
    };
}]);
