angular.module('createQuizApp').controller('CreateController', ['QuizData', '$log', '$location', '$routeParams', '$timeout', '$scope','$rootScope', function(QuizData, $log, $location, $routeParams, $timeout,$scope,$rootScope){
    var self = this;

    //for autocomplete    
    self.topics = [];
    self.topicList = [];

    //whether it's the first time you create a question
    self.firstTime = true;

    //fields on the page
    self.currentQuestion = 1;
    self.mode = "Create";

    self.question = "";
    self.answerText = "";
    self.alt1 = "";
    self.alt2 = "";
    self.alt3 = "";
    self.topic = "";
    self.imageURL = "";
    self.showTextArea = false;

    self.id = $routeParams.id;
    if (self.id==undefined) $location.path("/");

    QuizData.getQuiz(self.id, true, function(quiz){
        self.quiz = quiz;
        if (self.quiz.questions!=undefined) {
            self.currentQuestion = self.quiz.questions.length+1;
        }
        if (self.quiz.latexEnabled==undefined) {
            self.quiz.latexEnabled = false;
        }
        if (self.quiz.imageEnabled==undefined) {
            self.quiz.imageEnabled = false;
        }
        if (self.quiz.latexEnabled) {
            for (var i in self.quiz.questions) {
                var question = self.quiz.questions[i];
                setTimeout(function() {
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("questionMathRow"+question.uuid)[0]]);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("answerTextMathRow"+question.uuid)[0]]);
                },4000);
            }
        }
        self.currentQuiz = self.quiz.name;
        self.rootTopicId = quiz.categoryId;
        QuizData.getTopics(function(topics){
            if (topics) {
                for (var i in topics) {
                    if (topics[i].parentCategoryId==self.rootTopicId) {
                        self.topics.push(topics[i]);
                        self.topicList.push(topics[i].name);
                        if (self.topicList.length>0) {
                            $( "#topic" ).autocomplete({
                                source: self.topicList
                            });
                        }
                    }
                }
            }
        });
    });

    self.clearQuestions = function(){
        self.question = "";
        self.answerText = "";
        self.alt1 = "";
        self.alt2 = "";
        self.alt3 = "";
        self.imageURL = "";
        $("#questionId").val("");
        $timeout(function(){
            angular.element('#question').trigger('focus');
        });
    };

    self.nextFromAnswer = function(){
        self.focusAlt(1);
    };

    self.focusAlt = function(altIdx){
        $timeout(function(){
            $('#alt' + altIdx).focus();
        });
    };

    self.focusQuestion = function(){
      $('#question').focus();
    };

    self.focusAnswer = function(){
      $('#answer').focus();
    };

    self.focusTopic = function(){
      $('#topic').focus();
    };

    self.latexCheck = function() {
        return self.question.length>0 && (self.question.match(/\$/g) || []).length>1;
    }

    var resizeAll = function() {
        setTimeout(function() {
            $("#alt1").resize();
            $("#alt2").resize();
            $("#alt3").resize();
            $("#alt1a").resize();
            $("#alt2a").resize();
            $("#alt3a").resize();
            $("#question").resize();
            $("#answer").resize();
        },1000);
    }

    self.addQuestion = function() {
        var topicId="";
        var questionId = $("#questionId").val();
        if ($("#topic").val()!="" && $("#topic").val()!=self.topic) {
            self.topic = $("#topic").val();
        }
        if (self.topic!="") {
            var found = false;
            for (var i in self.topics) {
                if (self.topics[i].name==self.topic) {
                    topicId = self.topics[i].uuid;
                    found = true;
                }
            }
            if (!found) {
                self.topicList.push(self.topic);
                var topic_object = {
                    uuid: uuid.v4(),
                    name: self.topic,
                    newObject: true,
                    subContent: true,
                    parentCategoryId: self.rootTopicId
                }
                topicId = topic_object.uuid;
                self.topics.push(topic_object);
                $( "#topic" ).autocomplete({
                    source: self.topicList
                });
            }
        }
        if(self.question.length == 0) {
            alert("Please enter a question");
            self.focusQuestion();
            return;
        }

        if(self.answerText.length == 0) {
            alert("Please enter an answer");
            self.focusAnswer();
            return;
        }
        var newAnswer = false;
        if (questionId=="") {
            questionId = uuid.v4();
            newAnswer = true;
        }
        var question_obj = {uuid: questionId , question: self.question, answer: self.answerText};
        if (self.imageURL!="") {
            question_obj['imageURL'] = self.imageURL;
        }
        if (topicId!="") {
            question_obj['topicId'] = topicId;
        }
        if (self.alt1!="") {
            var alternatives = [self.alt1, self.alt2, self.alt3];
            question_obj['alternatives'] = alternatives;
        }
        var found = false;
        if (!newAnswer) {
            for (var i in self.quiz.questions) {
                if (self.quiz.questions[i].uuid!=undefined && self.quiz.questions[i].uuid==questionId) {
                    found = true;
                    self.quiz.questions[i] = question_obj;
                }
            }
            if (!found) {
                self.quiz.questions.push(question_obj);
            }
        }
        else {
            if (!self.quiz.questions) self.quiz.questions = [];
            self.quiz.questions.push(question_obj);
        }
        self.mode = "Create";
        if (self.quiz.questions.length==1 && self.firstTime) {
            self.firstTime = false;
            QuizData.showMessage("Congratulations!","Great! You've created your first question. It's been added to the list below. Go ahead and create a few more questions. Once you're done, click \"I'm Finished\" to let your class take this quiz!");
        }
        self.currentQuestion = self.quiz.questions.length+1;
        self.clearQuestions();
        QuizData.saveQuiz(self.quiz, self.topics);
        resizeAll();
        $("#quizzes").show();
        if (self.quiz.latexEnabled) {
            setTimeout(function() {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("questionMathRow"+question_obj.uuid)[0]]);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("answerTextMathRow"+question_obj.uuid)[0]]);
            },1000);
        }
        $('#questionsAnd').animate({"scrollTop": $('#questionsAnd')[0].scrollHeight}, "slow");
    };

    var addMath = function(field) {
        var value = self[field];
        $("#"+field+"Math").text(value == undefined ? "" : value);
        MathJax.Hub.Queue(["Typeset", MathJax.Hub, $("#"+field+"Math")[0]]);
    }

    self.editQuestion = function(idx){
        var q = self.quiz.questions[idx];
        self.question = q.question;
        self.answerText = q.answer;
        if (q.uuid==undefined) {
            q.uuid = uuid.v4();
        }
        $('#questionId').val(q.uuid);
        if (q.topicId) {
            for (var i in self.topics) {
                if (self.topics[i].uuid==q.topicId) {
                    self.topic = self.topics[i].name;
                }
            }

        }
        if(q.alternatives){
            for(var i=1; i<4; i++)
                self['alt' + i]=q.alternatives[i-1];
        }
        if (q.imageURL) {
            self.imageURL = q.imageURL;
        }
        $('#question').focus();
        self.mode = "Edit";
        self.currentQuestion = idx+1;
        if (self.quiz.latexEnabled) {
            addMath("question");
            addMath("answerText");
            addMath("alt1");
            addMath("alt2");
            addMath("alt3");
        }
        resizeAll();
        //self.quiz.questions.splice(idx,1);
    };

    self.remove = function(idx){
        self.quiz.questions.splice(idx, 1);
    };

    self.finished = function(){
        if(self.question.length > 0 && self.answerText.length > 0){
            self.addQuestion();
        }
        QuizData.saveQuiz(self.quiz, self.topics);
        $location.path("/published/" + self.id+"/p");
    };

    self.toggleLatex = function() {
        $rootScope.latexAtivated = self.quiz.latexEnabled;
    }

    self.toggleImage = function() {

    }

    self.loadImage = function(question) {
        $('#mylink').ekkoLightbox({remote: question.imageURL, title: question.question, footer: question.answer});
    }

    self.editQuiz = function() {
        $location.path("/edit/"+self.id);
    }

    self.showUpload = function() {
        self.showTextArea = !self.showTextArea;
    }

    self.uploadData = function() {
        var lines = self.uploader.split("\n");
        for (var i in lines) {
            var line = lines[i].split("\t");
            self.question = line[0].replace(new RegExp('@@@@', 'g'), '\n');
            self.answerText = line[1].replace(new RegExp('@@@@', 'g'), '\n');;
            if (line.length>2) {
                self.topic = line[2];
            }
            if (line.length>3) {
                self.alt1 = line[3].replace(new RegExp('@@@@', 'g'), '\n');;
            }
            if (line.length>4) {
                self.alt2 = line[4].replace(new RegExp('@@@@', 'g'), '\n');;
            }
            if (line.length>5) {
                self.alt3 = line[5].replace(new RegExp('@@@@', 'g'), '\n');;
            }
            if (line.length>6) {
                self.imageURL = line[6];
            }
            self.addQuestion();
        }
        console.log("Uploading" + lines.length);
    }

    $log.debug(self);

}]);
