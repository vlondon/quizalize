angular.module('createQuizApp').controller('CreateQuizController', ['QuizData', '$log', '$http', '$location', '$routeParams', function(QuizData, $log, $http, $location,$routeParams){
    var self = this;
    //form fields
    self.id = $routeParams.id;

    //use for autocomplete
    self.rootTopicList = [];
    self.rootTopics = [];
    var oldOne = false;

    self.showSettings = false;

    self.focusTopic = function(){
        $('#category').focus();
    }

    self.focusQuiz = function() {
        $('#question').focus();   
    }

    self.createQuiz = function(){
        var found = false;
        var rootTopicId = "-1";
        self.quiz.category = $("#category").val();
        for (var i in self.rootTopics) {
            if (self.rootTopics[i].name==self.quiz.category) {
                //we already have this category
                rootTopicId = self.rootTopics[i].uuid;
                found = true;
                break;
            }
        }
        if (found) {
            QuizData.setRootTopic(rootTopicId);            
        }
        self.quiz.categoryId = rootTopicId;

        QuizData.addQuiz(self.quiz,function(uuid) {
            if (oldOne) {
                QuizData.saveQuiz(self.quiz);
            }
            $location.path("/create/" + uuid);
            $log.debug("going to /create/" + uuid);
        });
    };

    if (!QuizData.getUser()) {
        $location.path("/register/create"); 
    }
    if (self.id) {
        oldOne = true;
        QuizData.getQuiz(self.id, true, function(quiz){      
            self.quiz = quiz;            
            if (self.quiz.settings==undefined) {
                self.quiz.settings = {};
            }            
            self.settings = self.quiz.settings;
            if (self.quiz.attributes = undefined) {
                self.quiz.attributes = {};
            }
        });
    }
    else {
        self.quiz = {
            name: "",
            category: "",
            subject: "",
            questions: [],
            settings: {
                numQuestions: "",
                random: false        
            }            
        }        
        self.settings = self.quiz.settings;
        if (self.quiz.attributes = undefined) {
            self.quiz.attributes = {};
        }
    }


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

    $log.debug(self);

}]);
