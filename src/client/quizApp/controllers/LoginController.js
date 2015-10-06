angular.module('quizApp').controller('LoginController', ['QuizData', '$log', '$routeParams', '$location', '$http', '$scope', function(QuizData, $log, $routeParams, $location,$http,$scope){
    var self = this;

    self.name = "";
    self.classcode = "";
    self.code = "";
    self.loadedApp = false;
    self.app = {
        name: "Quizalize",
        description: "",
        colour: "#f2f2f2"
    };

    if ($routeParams.code) {
        self.code = $routeParams.code;
    }
    else {
        try {
            if (typeof localStorage != 'undefined' && localStorage.getItem("gameCode")) {
                self.code = localStorage.getItem("gameCode");
            }
        }
        catch (err) {

        }
    }

    self.focusClassCode = function() {
        $('#classcode').focus();
    };

    self.checkCanSubmit = function() {
        return self.name=='' || self.classcode=='';
    };

    var goToLoggedIn = function() {
        $location.path("/list");
    };

    self.loadAppButton = function() {
        if (self.code) {
            $location.path("/app/" + self.code);
        }
        else {
            $location.path("/app");
        }
    };

    self.quizalize = function() {
        QuizData.resetGame();
        location.reload(); 
    };

    self.login = function() {
        QuizData.loginUser(self.name, self.classcode, function(err,resp) {
            if (!err) {
                if (window.ga){
                    window.ga('send', 'event', 'class', 'play', self.classcode);
                }
                $location.path("/list");
                goToLoggedIn();
            }
            else {
                if (window.ga){
                    window.ga('send', 'event', 'error-class', err, resp);
                }
                QuizData.showMessage("Login Error", "Please check that you entered the class code correctly");
            }
        });
    };

    self.loadApp = function() {
        QuizData.loadApp(self.code, function(err,resp) {
            if (!err) {
                self.app = resp.meta;
                self.loadedApp = true;
            }
            else {
                QuizData.showMessage("App Error", "Please check that you entered the code correctly");
            }
        });
    };

    self.home = function() {
        if (self.code) {
            $location.path("/code/" + self.code);
        }
        else {
            $location.path("/");
        }
    };

    self.appColour = function() {
        if (self.app) {
            return self.app.colour;
        }
        return "#f2f2f2";
    };

    self.iconURL = function() {
        if (self.app && self.app.iconURL) {
            return "https://d15tuytjqnsden.cloudfront.net/" + self.app.iconURL;
        }
    };


    if (QuizData.isLoggedIn()) {
        //we're already logged in. Let's go to the class list
        goToLoggedIn();
    }
    else if (self.code) {
        self.loadApp();
    }
}]);
