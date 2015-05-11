angular.module('createQuizApp').controller('DashboardController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    
    $log.debug(self);

    self.createQuiz = function() {
        if (!QuizData.getUser()) {
            $location.path("/register/create"); 
        }
        else {
            $location.path("/create");
        }        
    }

}]);
