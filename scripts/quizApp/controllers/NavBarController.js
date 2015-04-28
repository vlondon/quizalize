angular.module('quizApp').controller('NavBarController', ['QuizData','$log', '$timeout', function(QuizData,$log, $timeout){
    var self = this;

    self.confirmed = function() {
        QuizData.confirmed($("#modalUuid").val());
    }


}]);
