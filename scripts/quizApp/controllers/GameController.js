angular.module('quizApp').controller('GameController', ['QuizData', '$log', '$location','$rootScope', '$routeParams', function(QuizData, $log, $location,$rootScope,$routeParams){
    var self = this;

    self.id = $routeParams.id;
    self.catId = $routeParams.catId;
    if(self.catId==undefined) $location.path("/public");
    if(self.id==undefined) $location.path("/public");

    if (self.catId=="A") {
    	sessionStorage.setItem("teacher",true);
    }

    QuizData.selectQuiz(self.catId,self.id,function() {    	
        self.name = QuizData.currentQuizData.name;
    });   

    self.start = function(){
        $location.path("/quiz/" +  QuizData.chooseKind(0) + "/0");
    };         
}]);
