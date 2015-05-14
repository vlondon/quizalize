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
    self.showSettings = false;

    self.id = $routeParams.id;
    if (self.id==undefined) $location.path("/");

    QuizData.getQuiz(self.id, true, function(quiz){
        self.quiz = quiz;
        if (self.quiz.questions!=undefined) {
            self.currentQuestion = self.quiz.questions.length+1;    
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
        $("#alt1").resize();
        $("#alt2").resize();
        $("#alt3").resize();
        $("#alt1a").resize();
        $("#alt2a").resize();
        $("#alt3a").resize();
        $("#question").resize();
        $("#answer").resize();                
    }

    self.addQuestion = function() {
        var topicId="";
        var questionId = $("#questionId").val();
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
        QuizData.saveQuiz(self.id, self.quiz, self.topics);
        resizeAll();
        $("#quizzes").show();             
        $('#questionsAnd').animate({"scrollTop": $('#questionsAnd')[0].scrollHeight}, "slow");
    };

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
        QuizData.saveQuiz(self.id, self.quiz, self.topics);
        $location.path("/published/" + self.id+"/p");
    }; 

    self.enableLatex = function() {
        $rootScope.latexAtivated = self.latexEnabled;
    } 

    self.toggleSettings = function() {
        self.showSettings = !self.showSettings;
    }

    self.loadImage = function(question) {
        $('#mylink').ekkoLightbox({remote: question.imageURL, title: question.question, footer: question.answer});  
    }

    $log.debug(self);

}]);
