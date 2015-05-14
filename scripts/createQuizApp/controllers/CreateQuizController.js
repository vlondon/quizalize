angular.module('createQuizApp').controller('CreateQuizController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    //form fields
    self.subject = "";
    self.newQuizName = "";
    self.newQuizCategory = "";
    self.numQuestionsInQuiz = -1;

    //use for autocomplete
    self.rootTopicList = [];
    self.rootTopics = [];

    self.showSettings = false;

    self.focusTopic = function(){
        $('#category').focus();
    }

    self.focusQuiz = function() {
        $('#question').focus();   
    }

    self.createQuiz = function(){
        if (self.newQuizCategory.length ==0) {
            self.newQuizCategory = "";
        }
        var found = false;
        var rootTopicId = "-1";
        for (var i in self.rootTopics) {
            if (self.rootTopics[i].name==self.newQuizCategory) {
                //we already have this category
                rootTopicId = self.rootTopics[i].uuid;
                found = true;
                break;
            }
        }
        if (found) {
            QuizData.setRootTopic(rootTopicId);
        }

        QuizData.addQuiz({subject: self.quizSubject, name: self.newQuizName, categoryId: rootTopicId, category: self.newQuizCategory, questions: []},function(uuid) {
            $location.path("/create/" + uuid);
            $log.debug("going to /create/" + uuid);
        });
    };

    if (!QuizData.getUser()) {
        $location.path("/register/create"); 
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
