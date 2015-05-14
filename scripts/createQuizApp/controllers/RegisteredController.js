angular.module('createQuizApp').controller('RegisteredController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', '$scope',function(QuizData, $log, $location,$rootScope,$routeParams,$scope){
    var self = this;

    self.id = $routeParams.id;
    self.postAction = $routeParams.postAction;
    self.message = "";

    if (self.postAction=="create") {
        self.message = " you can create your quiz";
    }
    else if (self.postAction=="public") {
        self.message = " you can play this quiz in your class";
    }
    if (self.postAction=="preview") {
        self.message = " you can preview this quiz";
    }


    var continueFunction = function() {
        $scope.$apply(function(){
            if (self.postAction=="create") {
                $location.path("/create");
            }
            else if (self.postAction=="public") {
                $location.path("/published/"+self.id+"/b");                    
            }
            else if (self.postAction=="preview") {
                alert("/app#/play/public/"+self.id+"/true");
                window.location.href="/app#/play/public/"+self.id+"/true";
            }
            else if (self.postAction.indexOf("share:")==0) {
                alert("/app#/play/" + self.postAction + "/"+self.id+"/false");
                window.location.href="/app#/play/" + self.postAction + "/"+self.id+"/true";    
            }
        });
    }

    self.continue = function() {
        continueFunction();   
    }

    setTimeout(function() {
        continueFunction()
    }, 4000);
}]);
