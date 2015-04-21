angular.module('createQuizApp').controller('NavBarController', ['$log', '$timeout', function($log, $timeout){
    var self = this;
    self.showHelp = false;
    self.previewLink = "2345";

    self.dismiss = function(){
        self.showHelp = !self.showHelp;
        localStorage.setItem("showHelp", true);
    }

}]);
