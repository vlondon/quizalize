angular.module('quizApp').controller('AppController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;

    self.name = "";
    self.classcode = "";
    self.code = "";
    self.loadedApp = false;
    self.app = {
        name: "Quizalize App Portal",
        description: "Enter the code for your app",
        colour: "#f2f2f2"
    };

    if ($routeParams.code) {
        self.code = $routeParams.code;
    }
    else {
        self.code = QuizData.getDataValue("gameCode");
    }

    self.checkCanSubmit = function() {
        return self.code=='';
    };

    var goToLoggedIn = function() {
        $location.path("/list");
    };

    self.home = function() {
        if (self.code) {
            $location.path("/code/" + self.code);
        }
        else {
            $location.path("/");
        }
    };

    self.quizalize = function() {
        QuizData.resetGame();
        $location.path("/");
    };

    self.appColour = function() {
        return self.app.colour;
    };



    self.login = function() {
        QuizData.loadApp(self.code, function(err,resp) {
            if (!err && resp) {
                self.app = resp.meta;
                $location.path("/list/" + self.code);
            }
            else {
                QuizData.showMessage("App Error", "Please check that you entered the code correctly");
            }
        });
    };

    if (QuizData.isLoggedIn()) {
        //we're already logged in. Let's go to the class list
        goToLoggedIn();
    }
    else if (self.code) {
        self.login();
    }
}]);
