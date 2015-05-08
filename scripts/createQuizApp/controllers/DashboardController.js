angular.module('createQuizApp').controller('DashboardController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    
    $log.debug(self);

    if(typeof ($location.search()).token != 'undefined'){
        //Have quiz name
        self.token = $location.search().token;
    }
    else if (localStorage.getItem("token")!=undefined) {
        //
        self.token = localStorage.getItem("token");
    }
    if (self.token!=undefined) {
        $http.get("/quiz/token/"+self.token)
            .success(function(result){
                if (result=="Invalid Request") {
                    //bad token
                    QuizData.unsetUser();
                    $location.path("/quiz#");
                }
                else {
                    //to get user uuid and name
                    QuizData.setUser(result);
                }
            })
            .error(function(err){
                $log.error("error gettint profile",err)
                QuizData.unsetUser();
                $location.path("/quiz#");                
            })
    }

    self.createQuiz = function() {
        if (!QuizData.getUser()) {
            $location.path("/register/create"); 
        }
        else {
            $location.path("/create");
        }        
    }

}]);
