angular.module('quizApp').controller('QuizzesController', ['QuizData', '$log', '$location', '$timeout', '$scope', '$routeParams', function(QuizData, $log, $location, $timeout,$scope, $routeParams){
    var self = this;

    self.loading = true;
    self.orderIndex = "category.name";
    self.hasQuizzes = false;

    self.startQuiz = function(categoryId,quizId){
        $location.path("/quiz/"+categoryId+"/"+quizId);
    };
    if ($routeParams.code) {
        self.code = $routeParams.code;
    }
    else {
        self.code = QuizData.getDataValue("gameCode");
    }


    var loadQuizzes = function() {
        self.user = QuizData.getUser();
        self.name = QuizData.getUsername();
        self.hasQuizzes = false;
        QuizData.loadPlayerQuizzes(function(err, res){
            self.loading = false;
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
   };

    self.reloadQuizzes = function(){
        $log.debug("Reloading Quizzes");
        self.loading = true;

        $timeout(function(){
            self.reloadActive = true;
        }, 2000);
        loadQuizzes();
    };

    self.iconURL = function() {
        if (self.app && self.app.iconURL) {
            return "https://d15tuytjqnsden.cloudfront.net/" + self.app.iconURL;
        }
    };

    self.appColour = function() {
        if (self.app) {
            return self.app.colour;
        }
        else {
            return "#404040";
        }
    };

    self.logout = function(){
        QuizData.unsetUser();
        $location.path("/");
    };

    self.showStats = function() {
        $location.path("/stats");
    };

    if (typeof($location.search()).cancel != 'undefined' && $location.search().cancel){
        QuizData.removeItem("token");
    }
    else if(typeof ($location.search()).token != 'undefined'){
        //Have quiz name
        self.token = $location.search().token;
    }
    else {
        //
        self.token = QuizData.getDataValue("token");
    }
    if (self.token!=undefined) {
        zzish.getCurrentUser(self.token, function(err,message) {
            if (!err) {
                QuizData.setUser(message);
                QuizData.registerUserWithGroup(message.attributes.groupCode,function(err) {
                    if (!err) {
                        loadQuizzes();
                    }
                    else {
                        QuizData.unsetUser();
                        $location.path("/app#");
                    }
                });
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
        else if (self.code) {
            QuizData.loadApp(self.code, function(err,resp) {
                if (!err) {
                    self.app = resp.meta;
                    QuizData.loadQuizzes(self.app, function(err, quizzes) {
                        self.hasQuizzes = true;
                        self.quizzes = quizzes;
                        self.categories = QuizData.getCategories();
                    });
                }
                else {
                    QuizData.showMessage("App Error", "Please check that you entered the code correctly");
                }
            });
        }
        else {
            $location.path("/");
        }
    }
}]);
