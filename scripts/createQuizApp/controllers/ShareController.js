angular.module('createQuizApp').controller('ShareController', ['QuizData', '$log', '$routeParams', '$location', function(QuizData, $log, $routeParams, $location){
    var self = this;
    self.quiz = undefined;

    self.code = $routeParams.code;
    if (self.code==undefined) $location.path("/");

    QuizData.getQuizByCode(self.code,function(result) {
    	self.quiz = result;
        if (QuizData.getUser()) {
            self.quiz.link = "/app#/play/share:"+result.profileId+"/" + result.uuid+"/true";
        }
        else {
            self.quiz.link = "/quiz#/playh/share:" + result.profileId + "/"+result.uuid;
        }
    })

    self.assignQuiz = function(quiz) {
        quiz.share = true;
		QuizData.addQuiz(quiz,function() {
			$location.path("/preview/" + quiz.uuid);	
		})        
    }
}]);
