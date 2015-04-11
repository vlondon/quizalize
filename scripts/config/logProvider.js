angular.module('quizApp')
    .config(['$logProvider', function($logProvider){
        $logProvider.debugEnabled(true);
    }]);
