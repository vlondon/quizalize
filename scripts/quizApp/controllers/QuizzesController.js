angular.module('quizApp').controller('QuizzesController', ['QuizData', '$log', '$location', '$timeout', '$scope', function(QuizData, $log, $location, $timeout,$scope){
    var self = this;

    self.loading = true;
    self.orderIndex = "category.name";
    self.hasQuizzes = false;

    self.startQuiz = function(categoryId,quizId){
        $location.path("/quiz/"+categoryId+"/"+quizId);
    };

    var loadQuizzes = function() {
        self.user = QuizData.getUser();
        self.name = QuizData.getUsername();
        QuizData.loadPlayerQuizzes(function(err, res){
            if(!err){
                self.categories = QuizData.getCategories();
                for (var i in self.categories) {
                   self.hasQuizzes = true;
                }
                self.loading = false;
            }else{
                $log.error("Unable to refresh quizzes", err);
            }
       });
    }

    self.reloadQuizzes = function(){
        $log.debug("Reloading Quizzes");
        self.loading = true;

        $timeout(function(){
            self.reloadActive = true;
        }, 2000);
        loadQuizzes();
    };

    self.logout = function(){
        QuizData.unsetUser();
        $location.path("/");
    };

    if(typeof ($location.search()).token != 'undefined'){
        //Have quiz name
        self.token = $location.search().token;
    }
    else if (localStorage.getItem("token")!=undefined) {
        //
        self.token = localStorage.getItem("token");
    }
    if (self.token!=undefined) {
        zzish.getCurrentUser(self.token,function(err,message) {
            if (!err) {
                QuizData.setUser(message);
                QuizData.registerUserWithGroup(message.attributes.groupCode,function() {
                    loadQuizzes();
                })
            }
            else {
                QuizData.unsetUser();
                $location.path("/app#");
            }
        });
    }
    else {
        if (QuizData.isLoggedIn()) {
            loadQuizzes();
        }
        else {
            $location.path("/");
        }
    }
}]);
