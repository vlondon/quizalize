angular.module('createQuizApp', ['ngRoute', 'ngAnimate']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
                templateUrl: "/quiz/view/quizList",
                controller: "QuizzesController",
                controllerAs: "quizzes"
            })
            .when('/create/:id', {
                templateUrl: "/quiz/view/create",
                controller: "CreateController",
                controllerAs: "create"
            })
            .when('/preview/:id', {
                templateUrl: "/quiz/view/preview",
                controller: "PreviewController",
                controllerAs: "preview"
            })
            .when('/delete/:id', {
                templateUrl: "/quiz/view/quizList",
                controller: "DeleteController",
                controllerAs: "delete"
            })
            .otherwise({redirectTo: '/'})
}])
.config(['$logProvider', function($logProvider){
        $logProvider.debugEnabled(true);
}]);


angular.module('createQuizApp').run(["$rootScope", "$anchorScroll" , function ($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", function() {
        $anchorScroll();
    });
    FastClick.attach(document.body);
}]);

angular.module('createQuizApp').directive('onEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.onEnter);
                });
                event.preventDefault();
            }
        });
    };
});

//Note that unlike the enter key this does not prevent default:
// in our usage we merely want to inform users on press not change UI behaviour
angular.module('createQuizApp').directive('onTab', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 9) {
                scope.$apply(function (){
                    scope.$eval(attrs.onTab);
                });
            }
        });
    };
});

angular.module('createQuizApp').factory('QuizData', ['$http', '$log', function($http, $log){
    // setup/add helper methods, variables...

    var userUuid = localStorage.getItem("userId");
    var userVerified = localStorage.getItem("userVerified")=="true";

    //Initialise User
    var data = localStorage.getItem("quizData");
    data = JSON.parse(data);

    if(!data){
        data = [];
    }

    var timesQuiz = [];

    for(var i=1; i<12; i+=2){
        for(var j=2; j<13; j+=2){
            timesQuiz.push({question: "What is " + i + " times " + j + "?",
                            answer: String(i * j)});
        }
    }

    timesQuiz = function(o){
        for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
        return o;
    }(timesQuiz);

    //currently is cities and times quizes
    var sampleData = {"Verbs3(Year3)":{"name":"Verbs 3 (Year 3)","questions":[{"question":"I ______ dreams can come true.","answer":"believe","alternatives":["behave","tell","talk"]},{"question":"Builders _______ a new house next door.","answer":"built"},{"question":"You may _______ to light a fire for warmth.","answer":"decide"},{"question":"The class enjoys ________ new words.","answer":"learning"},{"question":"We _______ what the thief looked like.","answer":"described"},{"question":"Zofia was ________ to win the quiz!","answer":"surprised"},{"question":"Glue makes glitter _______ to the paper.","answer":"stick"},{"question":"The cat _______ the dog was a danger.","answer":"thought"},{"question":"The way snowflakes ______ is interesting","answer":"form"},{"question":"I _______ to always try my best at school!","answer":"promise"}]},"TimesTable(1to6)":{"name":"Times Table (1 to 6)","questions":[{"question":"5 x 2","answer":"10","alternatives":["5","12","8"]},{"question":"3 x 3","answer":"9"},{"question":"4 x 6","answer":"24"},{"question":"1 x 12","answer":"12"},{"question":"6 x 7","answer":"42"},{"question":"5 x 11","answer":"55"},{"question":"2 x 8","answer":"16"},{"question":"6 x 9","answer":"54"},{"question":"3 x 12","answer":"36"},{"question":"6 x 5","answer":"30"}]},"ArtistsandPaintings":{"name":"Artists and Paintings","questions":[{"question":"Who painted the Mona Lisa?","answer":"Leonardo Da Vinci"},{"question":"Who painted The Scream?","answer":"Edward Munch"},{"question":"Who painted The Starry Night ","answer":"Vincent van Gogh"},{"question":"Who painted Guernica?","answer":"Pablo Picasso"},{"question":"Who painted Girl with a Pearl Earring?","answer":"Johannes Vermeer"},{"question":"Who painted The Night Watch?","answer":"Rembrandt"},{"question":"Who painted The Creation of Adam in the Sistine Chapel?","answer":"Mihcelangelo"},{"question":"Who painted The Persistence of Memory","answer":"Salvador Dali"},{"question":"Who painted Water Lilies?","answer":"Claude Monet"},{"question":"Who painted Bathers at Asnières?","answer":"George Seurat"}]},"Shapes(2D)":{"name":"Shapes (2D)","questions":[{"question":"What shape has four equal sides?","answer":"Square"},{"question":"What shape has six sides?","answer":"Hexagon"},{"question":"What shape has three equal sides","answer":"Equilateral Triangle"},{"question":"What shape has eight sides?","answer":"Octagon"},{"question":"What shape has ten sides?","answer":"Decagon"},{"question":"What shape has four equal angles but not four equal sides? ","answer":"Rectangle"},{"question":"What shape has five sides?","answer":"Pentagon"},{"question":"What shape three unequal sides?","answer":"Scalene Triangle"},{"question":"What shape has nine sides?","answer":"Nonagon"},{"question":"What shape has seven sides?","answer":"Septagon"}]},"EuropeanGeography(CapitalCities)":{"name":"European Geography (Capital Cities)","questions":[{"question":"What is the captial of Germany?","answer":"Berlin"},{"question":"What is the capital of Greece?","answer":"Athens"},{"question":"What is the capital of Portugal?","answer":"Lisbon"},{"question":"What is the capital of Russia?","answer":"Moscow"},{"question":"What is the capital of Sweden?","answer":"Stockholm"},{"question":"What is the captial of Ukraine?","answer":"Kiev"},{"question":"What is the capital of Austria?","answer":"Vienna"},{"question":"What is the capital of Poland?","answer":"Warsaw"},{"question":"What is the captial of Norway?","answer":"Oslo"},{"question":"What is the capital of Switzerland?","answer":"Bern"}]},"BritishHistory(WWI)":{"name":"British History (WWI)","questions":[{"question":"The assassination of whom triggered WWI?","answer":"Franz Ferdinand","alternatives":["George V","Nicholas II","Wilhelm II"]},{"question":"Who was the King of the United Kingdom?","answer":"George V"},{"question":"What was the name of the coalition fighting the Allied Powers?","answer":"Central Powers"},{"question":"Who was the Emperor of Russia? ","answer":"Nicholas II"},{"question":"Who was the British Prime Minister at the end of the war?","answer":"David Lloyd George"},{"question":"Which Empire had the biggest army in the war?","answer":"German Empire"},{"question":"Which Asian country fought with the Allied Powers?","answer":"Japan"},{"question":"Who was the Emperor of Germany?","answer":"Wilhelm II"},{"question":"Which member of the Allied Powers suffered the most casualties?","answer":"Russia"},{"question":"Who was the American President during WWI?","answer":"Woodrow Wilson"}]},"Spanish(Animals)":{"name":"Spanish (Animals)","questions":[{"question":"What is the Spanish for \u0027dog\u0027?","answer":"Perro"},{"question":"What is the Spanish for \u0027cat\u0027?","answer":"Gato"},{"question":"What is the Spanish for \u0027butterfly\u0027?","answer":"Mariposa"},{"question":"What is the Spanish for \u0027cow\u0027?","answer":"Vaca"},{"question":"What is the Spanish for \u0027monkey\u0027?","answer":"Mono"},{"question":"What is the Spanish for \u0027chicken\u0027?","answer":"Pollo"},{"question":"What is the Spanish for \u0027swan\u0027?","answer":"Cisne"},{"question":"What is the Spanish for \u0027bird\u0027?","answer":"Pájaro"},{"question":"What is the Spanish for \u0027horse\u0027?","answer":"Caballo"},{"question":"What is the Spanish for \u0027bee\u0027?","answer":"Abeja"}]},"French(Animals)":{"name":"French (Animals)","questions":[{"question":"What is the French for \u0027butterly\u0027?","answer":"Papillon"},{"question":"What is the French for \u0027cow\u0027?","answer":"Vache"},{"question":"What is the French for \u0027dog\u0027?","answer":"Chien"},{"question":"What is the French for \u0027chicken\u0027?","answer":"Poulet"},{"question":"What is the French for \u0027cat\u0027? ","answer":"Chat"},{"question":"What is the French for \u0027horse\u0027?","answer":"Cheval"},{"question":"What is the French for \u0027swan\u0027?","answer":"Cygne"},{"question":"What is the French for \u0027monkey\u0027?","answer":"Singe"},{"question":"What is the French for \u0027bee\u0027?","answer":"Abeille"},{"question":"What is the French for \u0027giraffe\u0027?","answer":"Girafe"}]},"Verbs5(Year5)":{"name":"Verbs 5 (Year 5)","questions":[{"question":"We were well _______ for the adventure.","answer":"equipped","alternatives":["quitted","equated","quoted"]},{"question":"The netball captain was _________ by the loss.","answer":"embarrassed"},{"question":"I want to ________ our cat to the vet.","answer":"accompany"},{"question":"The police _______ to know the proper law.","answer":"ought"},{"question":"Michael always ________ the teacher in class!","answer":"interrupts"},{"question":"My sister ________ an A grade in her maths exam.","answer":"achieved"},{"question":"The doctor ______ a severe case of measles.","answer":"diagnosed"},{"question":"I really _________ having friends to help me.","answer":"appreciate"},{"question":"Our teacher _______ us to attempt hard questions.","answer":"encourages"},{"question":"Birds of prey _______ down on smaller animals.","answer":"swoop"}]},"USGeography(StateCapitals)":{"name":"US Geography (State Capitals)","questions":[{"question":"What is the capital of Arizona?","answer":"Phoenix"},{"question":"What is the capital of Colorado?","answer":"Denver"},{"question":"What is the capital of Georgia?","answer":"Atlanta"},{"question":"What is the capital of Hawaii?","answer":"Honolulu"},{"question":"What is the capital of Indiana?","answer":"Indianapolis"},{"question":"What is the capital of Massachusetts?","answer":"Boston"},{"question":"What is the capital of New Mexico?","answer":"Santa Fe"},{"question":"What is the capital of Ohio?","answer":"Columbus"},{"question":"What is the capital of Tennessee?","answer":"Nashville"},{"question":"What is the capital of Texas?","answer":"Austin"}]},"InventorsandInventions":{"name":"Inventors and Inventions","questions":[{"question":"Who invented the electric light bulb?","answer":"Thomas Edison"},{"question":"Who invented the first powered areoplane?","answer":"The Wright Brothers"},{"question":"Who invented the first working telephone?","answer":"Alexander Graham Bell"},{"question":"Who invented the world wide web?","answer":"Tim Berners Lee"},{"question":"Who invented the first vaccine?","answer":"Edward Jenner"},{"question":"Who invented the television?","answer":"John Logie Baird"},{"question":"Who invented the first real computer?","answer":"Alan Turing"},{"question":"Who invented the steam engine?","answer":"James Watt"},{"question":"Who invented the hydrogen bomb?","answer":"Edward Teller"},{"question":"Who invented the first real battery?","answer":"Alessandro Volta"}]},"SimpleAlgebra":{"name":"Simple Algebra","questions":[{"question":"n6 \u003d 18","answer":"n \u003d 3"},{"question":"n2 + 3 \u003d 11","answer":"n \u003d 4"},{"question":"7 - 1n \u003d 0","answer":"n \u003d 7"},{"question":"10 + 5n \u003d 35","answer":"n \u003d 5"},{"question":"2n x 3n \u003d 5","answer":"n \u003d 1"},{"question":"n4 + 10 \u003d 34","answer":"n \u003d 6"},{"question":"5 + n3 \u003d 5","answer":"n \u003d 0"},{"question":"8n + 20 \u003d 100","answer":"n \u003d 10"},{"question":"5n + 5 \u003d 45","answer":"n \u003d 8"},{"question":"8 + 3n \u003d 14","answer":"n \u003d 2"}]},"Biology(HumanOrgans)":{"name":"Biology (Human Organs)","questions":[{"question":"An organ that pumps blood around the body?","answer":"Heart","alternatives":["Kidney","Lung","Bladder"]},{"question":"A sense organ used in touch?","answer":"Skin"},{"question":"An organ that fitlers blood?","answer":"Kidney"},{"question":"An organ that produces insulin?","answer":"Pancreas"},{"question":"A sense organ used in sight?","answer":"Eye"},{"question":"An organ that produces bile?","answer":"Liver"},{"question":"An organ used in respiration?","answer":"Lung"},{"question":"A female reproductive organ?","answer":"Ovary"},{"question":"A sense organ used in smell?","answer":"Nose"},{"question":"An organ that collects urine?","answer":"Bladder"}]},"BritishHistory(TheTudors)":{"name":"British History (The Tudors)","questions":[{"question":"Who defeated Richard III to end the War of the Roses","answer":"Henry VII ","alternatives":["Henry VIII","Henry VI","Henry V"]},{"question":"Which son of Henry Tudor had six wives?","answer":"Henry VIII"},{"question":"Who was the first wife of Henry VIII?","answer":"Catherine of Aragon"},{"question":"Which queen was the first daughter of Henry VIII?","answer":"Mary I"},{"question":"Who took the throne after Henry VIII died?","answer":"Edward VI"},{"question":"Which future queen was the sister of Mary I?","answer":"Elizabeth I"},{"question":"Who was Elizabeth I\u0027s mother?","answer":"Anne Boleyn"},{"question":"Which Catholic king did Mary I marry?","answer":"Philip of Spain"},{"question":"Which queen did Elizabeth I have imprisoned?","answer":"Mary Queen of Scots"},{"question":"Which Scottish king James I of England?","answer":"James VI of Scotland"}]},"TimesTable(7to12)":{"name":"Times Table (7 to 12)","questions":[{"question":"7 x 6","answer":"42","alternatives":["46","38","32"]},{"question":"12 x 3","answer":"36"},{"question":"8 x 9","answer":"72"},{"question":"11 x 5","answer":"55"},{"question":"8 x 4","answer":"32"},{"question":"9 x 6","answer":"54"},{"question":"10 x 11","answer":"110"},{"question":"12 x 12","answer":"144"},{"question":"9 x 10","answer":"90"},{"question":"7 x 4","answer":"28"}]}};

    function createUserId(callback) {
        if(!userUuid) {
            userUuid = uuid.v4();
            localStorage.setItem("userId", userUuid);            
            localStorage.setItem("userVerified", false);            

            $http.post("/create/profile", {uuid: userUuid})
                .success(function(result){
                    callback(null,result);
                    $log.debug("Got result from profile", result);
                })
                .error(function(err){
                    callback(err);
                    $log.error("Error when registering profile", err);
            });            
        }
        else {
            callback(null,userUuid);    
        }        
    }

    var postDelete = function(quiz){
        $log.debug(quiz);
        return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/delete", quiz);        
    };


    var postQuiz = function(quiz){
        $log.debug(quiz);
        return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid, quiz);        
    };

    var getQuizzes = function(){
        return $http.get("/create/" + userUuid + "/quizzes/");
    };

    var getQuiz = function(uuid){
        return $http.get("/create/" + userUuid + "/quizzes/" + uuid);
    };

    return{
        getSampleQuizzes: function(callback){
            callback(sampleData);
        },
        getQuizzes: function(callback){
            if (userUuid!="") {
                getQuizzes().success(
                    function(resp){
                        $log.debug(resp);
                        data = resp;
                        callback(data);
                    }
                );                
            }
        },
        getQuiz: function(id, callback){
            if(typeof data[id] != 'undefined'){
                if(typeof data[id].questions != 'undefined'){
                    $log.debug("Questions local");
                    callback(data[id]);
                }else{
                    $log.debug("No questions, so fetching from server");
                    getQuiz(data[id].uuid).success(function(resp){
                        $log.debug("Response from server for getting a quiz", resp);
                        callback(resp);
                    }).error(function(er){
                        $log.debug("Error from server when getting quiz", er);
                    });
                }
            }
        },
        deleteQuiz: function(id,callback){
            var quiz = data[id];
            data.splice(id,1);
            $log.debug("Removing Quiz: ", data);
            localStorage.setItem("quizData", JSON.stringify(data));
            postDelete(quiz).success(function(result){
                callback();
            });         
            
        },
        saveQuiz: function(id, quiz){
            data[id] = quiz;
            $log.debug("Saving Quiz: ", data);
            localStorage.setItem("quizData", JSON.stringify(data));
            postQuiz(quiz);
        },
        addQuiz: function(quiz, callback){
            //hide loginButton as you can no longer login if you haven't already done so
	        var email = localStorage.getItem("emailAddress");
            if (!userVerified && email==null) {
                $("#LoginButton").hide();    
            }            
            else if (email!=null) {
                $("#LoginButton").html("Logout");
            }
            if(!data) data = []; //yes it will replace [] with [].
            //get UserId (creates on if it doesn't already exist);
            createUserId(function(err,message) {
                if (quiz.uuid==undefined) {
                    quiz.uuid = uuid.v4();    
                }
                data.push(quiz);
                $log.debug("Saving (addQuiz): ", data);
                localStorage.setItem("quizData", JSON.stringify(data));
                callback(data.length -1);
            });
        },
        publishQuiz: function(quiz, details){
            $log.debug("Publish Quiz", quiz, details);
            return $http.post("/create/" + userUuid + "/quizzes/" + quiz.uuid + "/publish", details);
        },
        getClassCode: function(){
            return localStorage.getItem("classCode");
        },
        saveClassCode: function(newClassCode){
            if(newClassCode)
                localStorage.setItem("classCode", newClassCode);
        },
        setUser: function (user) {
            userUuid = user.uuid;
            localStorage.setItem("userId",userUuid);            
	    var email = localStorage.getItem("emailAddress");
            if (user.verified!=undefined) {
                userVerified = user.verified;    
            }
            else {
                userVerified = false;       
            }
            localStorage.setItem("userVerified",userVerified);
            if (userVerified || email!=null) {
                $("#LoginButton").html("Logout");
		$("#LoginButton").show();
            }            
            else {
                //just hide it, as this seems to be an anonymous user
                //$("#LoginButton").hide();
            }
            if (user.code!=undefined) {
                localStorage.setItem("classCode",user.code);
            }            
        }
    };
}]);

angular.module('createQuizApp').controller('NavBarController', ['$log', '$timeout', function($log, $timeout){
    var self = this;
    self.showHelp = false;
    self.previewLink = "2345";

    self.dismiss = function(){
        self.showHelp = !self.showHelp;
        localStorage.setItem("showHelp", true);
    }

}]);


angular.module('createQuizApp').controller('QuizzesController', ['QuizData', '$log', '$http', '$location', function(QuizData, $log, $http, $location){
    var self = this;
    self.newQuizName = "";

    if(typeof ($location.search()).name != 'undefined'){
        //Have quiz name
        self.newQuizName = $location.search().name;
        self.didSupplyQuizName = true;
        //$location.search({});
    }else if(typeof ($location.search()).sample != 'undefined') {
        //Have sample quiz
        self.sampleName = $location.search().sample;
        self.didRequestSample = true;
    }
    else if(typeof ($location.search()).token != 'undefined'){
        //Have quiz name
        self.token = $location.search().token;
        localStorage.setItem("token",self.token);
    }
    else if (localStorage.getItem("token")!=undefined) {
        //
        self.token = localStorage.getItem("token");
    }
    else if (localStorage.getItem("userId")!=undefined) {
        //we have a userId, check to see if we have some 
        self.userId = localStorage.getItem("userId");
    }
    self.previewlink = localStorage.getItem("link");
    if (self.token!=undefined) {
        $http.get("/quiz/token/"+self.token)
            .success(function(result){
                if (result=="Invalid Request") {
                    //bad token
                    localStorage.removeItem("token");
                    localStorage.removeItem("zzishtoken");
                    location.href="/quiz#";
                }
                else {
                    //to get user uuid and name
                    QuizData.setUser(result);
                    QuizData.getQuizzes(function(data){
                        self.pastQuizzes = data;

                        if(self.didSupplyQuizName){
                            $log.debug("Should create Quiz, with name", self.newQuizName);
                           self.createQuiz();
                        }
                    });

                }
            })
            .error(function(err){
                $log.error("error gettint profile",err)
            })                    
    }
    else if (self.userId!=undefined) {
        $http.get("/quiz/profile/"+self.userId)
            .success(function(result){
                //to get user uuid and name
                QuizData.setUser(result);
                QuizData.getQuizzes(function(data){
                    self.pastQuizzes = data;

                    if(self.didSupplyQuizName){
                        $log.debug("Should create Quiz, with name", self.newQuizName);
                       self.createQuiz();
                    }
                });
            })
            .error(function(err){

            }) 
    }
    else {
        QuizData.getQuizzes(function(data){
            self.pastQuizzes = data;

            if(self.didSupplyQuizName){
                $log.debug("Should create Quiz, with name", self.newQuizName);
               self.createQuiz();
            }

            if(self.didRequestSample){
                $log.debug("Should create sample Quiz", self.sampleName);
                // QuizData.getSampleQuizzes(function(data){
                //     var sampleQuizzes = data;

                //     if(typeof sampleQuizzes[self.sampleName] != 'undefined'){
                //         QuizData.addQuiz(sampleQuizzes[self.sampleName], function(idx) {
                //             QuizData.saveQuiz(idx, sampleQuizzes[self.sampleName]);
                //             $location.path("/preview/" + idx);
                //             // $location.path("/create/" + idx);
                //             $log.debug("going to /preview/" + idx);
                //         });
                //     }else{
                //         $log.error("Tried to create sample quiz which didn't exist");
                //     }
                // });
                QuizData.addQuiz({uuid:self.sampleName}, function(idx) {                    
                    $location.path("/preview/" + idx);
                    // $location.path("/create/" + idx);
                    $log.debug("going to /preview/" + idx);
                });
            }
        });        
    }


    self.createQuiz = function(){
        if(self.newQuizName.length == 0)
            self.newQuizName = "Quiz";

        QuizData.addQuiz({name: self.newQuizName, questions: []},function(idx) {
            $location.path("/create/" + idx);
            $log.debug("going to /create/" + idx);
        });
    };

    self.editQuiz = function(idx){
        $location.path("/create/" + idx);
        $log.debug("Editing quiz " + idx);
    };

    self.previewQuiz = function(idx){
        $location.path("/preview/" + idx);
        $log.debug("Viewing quiz " + idx);
    };

    self.deleteQuiz = function(idx){
        if (confirm("Are you sure you want to permanently delete this quiz?")) {
            $location.path("/delete/" + idx);
            $log.debug("Viewing quiz " + idx);            
        }
        
    };
    //self.editSampleQuiz = function(idx){
    //    var idx = QuizData.addQuiz( self.sampleQuizzes[idx]);
    //    $location.path("/create/" + idx);
    //    $log.debug("Editing quiz (from template) " + idx);
    //};

    $log.debug(self);

}]);


angular.module('createQuizApp').controller('CreateController', ['QuizData', '$log', '$location', '$routeParams', '$timeout', function(QuizData, $log, $location, $routeParams, $timeout){
    var self = this;

    self.hint = "";
    self.distractorsActive = false;

    self.id = parseInt($routeParams.id);
    if(isNaN(self.id)) $location.path("/");

    QuizData.getQuiz(self.id, function(quiz){
        self.quiz = quiz;
    });

    self.clearQuestions = function(){
        $('#question').val("");
        $('#question').val("");
        $('#answer').val("");
        $('#alt1').val("");
        $('#alt2').val("");
        $('#alt3').val("");

        $timeout(function(){
            angular.element('#question').trigger('focus');
        });


        for(var i=1; i<4; i++)
            self['alt' + i] = "";

        self.answerText = "";
    };

    self.nextFromAnswer = function(){
        if(self.distractorsActive){
            self.focusAlt(1);
        }else{
            self.addQuestion();
        }
    };

    self.focusAlt = function(altIdx){

        $timeout(function(){
            $('#alt' + altIdx).focus();
        });

    };

    self.focusQuestion = function(){
      $('#question').focus();
    };

    self.focusAnswer = function(){
      $('#answer').focus();
    };

    var alreadyShown = false;

    self.showEnterHint = function(){
        if(!alreadyShown) {
            $('#enterHint').slideDown('slow').delay(1500).slideUp('slow');
            alreadyShown = true;
        }
    };

    self.addQuestion = function() {
        var question = $('#question').val();
        var answer = $('#answer').val();

        if(question.length == 0) {
            self.focusQuestion();
            return;
        }

        if(answer.length == 0) {
            self.focusAnswer();
            return;
        }

        if(self.distractorsActive){
            var alternatives = [$('#alt1').val(), $('#alt2').val(), $('#alt3').val()];
            self.quiz.questions.push({question: question, answer: answer, alternatives: alternatives});
        }else{
            self.quiz.questions.push({question: question, answer: answer});
        }

        self.clearQuestions();

        $('#questionsAnd').animate({"scrollTop": $('#questionsAnd')[0].scrollHeight}, "slow");
    };

    self.editQuestion = function(idx){
        var q = self.quiz.questions[idx];
        $('#question').val(q.question);
        $('#answer').val(q.answer);
        if(q.alternatives){
            for(var i=1; i<4; i++)
                $('#alt' + i).val(q.alternatives[i-1]);
        }
        $('#question').focus();
        self.quiz.questions.splice(idx,1);
    };

    self.remove = function(idx){
        self.quiz.questions.splice(idx, 1);
    };

    self.finished = function(){
        var question = $('#question').val();
        var answer = $('#answer').val();
        if(question.length > 0 && answer.length > 0){
            self.addQuestion();
        }

        QuizData.saveQuiz(self.id, self.quiz);
        $location.path("/preview/" + self.id);
    };

    $log.debug(self);

}]);

angular.module('createQuizApp').controller('PreviewController', ['QuizData', '$log', '$routeParams', function(QuizData, $log, $routeParams){

    var self = this;
    self.emailAddress = localStorage.getItem("emailAddress");
    self.published = false;
    self.userVerified = localStorage.getItem("userVerified")=="true";

    self.id = parseInt($routeParams.id);
    if(isNaN(self.id)) $location.path("/");

    self.publish = function(){
        $log.debug("Publish with email address:", self.emailAddress, "Quiz:", self.quiz);


        if(self.userVerified || self.classCode || self.emailAddress){
            if(self.emailAddress && self.emailAddress.length > 0){
		      localStorage.setItem("emailAddress",self.emailAddress);
		      $("#LoginButton").html("Logout");
		      $("#LoginButton").show();
            }
	    self.publishing = true;

            var details = { emailAddress: self.emailAddress };
            if(self.classCode) details.code = self.classCode;
            $log.debug("Publishing with details", details, "Quiz", self.quiz);

            QuizData.publishQuiz(self.quiz, details).success(function(result){
                $log.debug("Response from publishing: ", result);
                self.classCode = result.code;
                self.link = result.link;
                localStorage.setItem("link",self.link);
                QuizData.saveClassCode(self.classCode);
                self.published = true;
                self.publishing = false;
            }).error(function(err){
                $log.debug("Error from publishing: ", err);
            });

        }else{
            self.statusText = "Please provide an email address"
        }
    };

    QuizData.getQuiz(self.id, function(qz){
        self.quiz = qz;

        self.classCode = QuizData.getClassCode();

        if(self.classCode || self.userVerified){
           self.publish();
        }

        $log.debug(self);
    });
}]);

angular.module('createQuizApp').controller('DeleteController', ['QuizData', '$log', '$location', '$routeParams', function(QuizData, $log, $location, $routeParams){
    self.id = parseInt($routeParams.id);
    if(isNaN(self.id)) $location.path("/");
    QuizData.deleteQuiz(self.id, function() {
        $log.debug("going to /");
        $location.path("/");
    });
}]);

