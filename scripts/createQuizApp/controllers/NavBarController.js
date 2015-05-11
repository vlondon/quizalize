angular.module('createQuizApp').controller('NavBarController', ['QuizData','$log', '$timeout', '$location', '$http', function(QuizData,$log, $timeout,$location,$http){
    var self = this;
    self.showHelp = false;

    var loadForUser = function() {
        $("#assignments").hide();            
        $("#quizzes").hide();            
        if (QuizData.getUser()) {
            $("#LoginButton").html("Logout");        
            QuizData.getGroupContents(function(data) {
                var hasData = false;
                for (var i in data) {
                    hasData = true;
                    break;
                }
                if (hasData) {
                    $("#assignments").show();            
                }            
                QuizData.getQuizzes(function(data) {
                    var hasData = false;
                    for (var i in data) {
                        hasData = true;
                        break;
                    }
                    if (hasData) {
                        $("#quizzes").show();
                    }
                })
            })
        }        
    }

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
                    if (result.attributes.groupCode!=undefined) {
                        QuizData.setCurrentClassByCode(result.attributes.groupCode,function() {
                                
                        });
                    }
                    loadForUser();
                }
            })
            .error(function(err){
                $log.error("error gettint profile",err)
                QuizData.unsetUser();
                $location.path("/quiz#");                
            })
    }
    else {
        loadForUser();
    }

    

    self.dismiss = function(){
        self.showHelp = !self.showHelp;
        if (self.showHelp) {
        	$("#intro").show();
        }
    }

    self.hasQuiz = function() {
    	return localStorage.getItem("quizData")!=null;
    }

    self.confirmed = function() {
        QuizData.confirmed($("#modalUuid").val());
    }

    self.login = function() {
        if (QuizData.unsetUser()) {
            //need to logout
            //logout();
            $location.path("/quiz#/");
        }
        else {
            $location.path("/login");    
        }
    }
}]);
