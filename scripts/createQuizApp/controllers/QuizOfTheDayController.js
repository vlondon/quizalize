angular.module('createQuizApp').controller('QuizOfTheDayController', ['QuizData', '$log', '$http', '$location','$routeParams','$scope',function(QuizData, $log, $http, $location,$routeParams,$scope){
    var self = this;
    //form fields
    //self.id = $routeParams.id;
    self.quiz = {};
    self.results = [];
    self.quantityToShow = 5;
    self.loading = true;

    var amberColour = "#FFA500";
    var greenColour = "#008000";
    var blueColour = "#0000FF";
    var redColour = "#FF0000";


    $scope.data_score = [100,10];
    $scope.labels_score = ["Current Score", ""];
    $scope.color_score = [redColour,'#A8A8A8','#ECF0f1'];

    $scope.data_per = [80,20];
    $scope.labels_per = ["Average Percentage", ""];
    $scope.color_per = [greenColour,'#A8A8A8'];

    QuizData.getPublicQuizzes(function (data) {
        for (var i in data.contents) {
            var quiz = data.contents[i];
            if (quiz.settings!=undefined && quiz.settings.featured==true) {                
                QuizData.getPublicQuiz(quiz.uuid,function(data){
                    self.quiz = data;   
                    if (self.quiz.settings==undefined) {
                        self.quiz.settings = {};    
                    }
                    if(self.quiz.settings.imageUrl==undefined) {
                        self.quiz.settings.imageUrl = '/cquiz/img/Moon.JPG';  
                    }
                    var totalqs = self.quiz.questions.length;           
                    var totalscore = totalqs*200;
                    QuizData.getResults(quiz.uuid,function(data){
                        self.results = data;                
                        var correct = 0;
                        var total = 0;
                        var score = 0;
                        if (self.results) {
                            var length = self.results.length;
                            for (var i in self.results) {
                                var instance = self.results[i];
                                correct+=instance.correct;
                                total+=instance.total;
                                score+=instance.score;
                            }
                            $scope.data_per[0] = Math.round(correct*100/total);
                            $scope.data_per[1] = 100-$scope.data_per[0];

                            $scope.data_score[0] = Math.round(score/length);
                            $scope.data_score[1] = totalscore-$scope.data_score[0];
                        }       
                        self.loading = false;   
                    });
                });  
            }
        } 
    }); 

    self.playQuiz = function(quiz) {
        window.location.href = "app#/play/" + quiz.categoryId + "/" + quiz.uuid + "/true";
    }    

    self.assignQuiz = function(quiz) {
        QuizData.addQuiz(quiz,function() {
            $location.path("/preview/" + quiz.uuid);    
        })                
    }
}]);
