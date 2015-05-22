angular.module('createQuizApp').controller('ResultsController', ['QuizData', '$log', '$http', '$location','$routeParams','$scope',function(QuizData, $log, $http, $location,$routeParams,$scope){
	var self = this;
	//form fields
	self.id = $routeParams.id;
	self.quiz = {};
	self.results = [];
	

	var amberColour = "#FFA500";
	var greenColour = "#008000";
	var blueColour = "#0000FF";
	var redColour = "#FF0000";


	self.completed = true;
    self.ALL = 100;
    self.quantityToShow = 100;
    self.loading = true;    
    
	$scope.data_score = [0,0];
	$scope.labels_score = ["Current Score", ""];
	$scope.color_score = [redColour,'#A8A8A8','#ECF0f1'];

	$scope.data_per = [0,0];
	$scope.labels_per = ["Average Percentage", ""];
	$scope.color_per = [greenColour,'#A8A8A8'];

    var calculateResults = function() {
        if (self.results) {
            var totalqs = 0;
            if (self.quiz.questions) {
                totalqs = self.quiz.questions.length;           
            }
            totalqs = 20;
            var totalscore = totalqs*200;
            var correct = 0;
            var total = 0;
            var score = 0;            

            var length = self.results.length;
            for (var i in self.results) {
                var instance = self.results[i];
                var colour = "green";
                if (instance.statusInt==0) {
                    colour = "blue";
                }
                else if (instance.statusInt==1) {
                    colour = "red";
                }
                instance.style = {'background-color': colour, 'border-radius': '4px', 'text-align': 'right'};
                correct+=instance.correct;
                total+=instance.total;
                score+=instance.score;
                if (totalscore>0) {
                    instance.width = (instance.score*100/totalscore);
                }
            }
            if (total!=0) {
                $scope.data_per[0] = Math.round(correct*100/total);
                $scope.data_per[1] = 100-$scope.data_per[0];

                $scope.data_score[0] = Math.round(score/length);
                $scope.data_score[1] = totalscore-$scope.data_score[0];                     
            }
        }   
        self.loading = false;
    }

	QuizData.getQuiz(self.id,true,function(data){
		self.quiz = data;   
		
		
		QuizData.getResults(self.id,function(data){
			self.results = data;
			self.allresults = data;				
            self.toggleCompleted(true);		
		});
	});

	self.toggleCompleted = function(update) {		
		if (!self.completed) {
			self.results = self.allresults;
		}
		else {
			var res = [];	
			for (var i in self.allresults) {
				if (self.allresults[i].statusInt==2) {
					res.push(self.allresults[i]);
				}
			}
			self.results = res;
		}
        calculateResults();
        if (update==undefined) {
            self.quantityToShow = self.ALL;    
        }        
	}

    self.updateValues = function() {
        calculateResults();
    }
}]);
