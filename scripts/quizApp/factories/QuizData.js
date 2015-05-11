var randomise = require('quizApp/utils/randomise');

angular.module('quizApp').factory('QuizData', ['$http', '$log', '$location', 'ZzishContent', function($http, $log, $location, ZzishContent){

    var userUuid = "";
    var userName = "";
    var classCode = "";



    var setUser = function(user) {
        if (user==undefined) {
            userUuid = "";    
            localStorage.clear();
            $("#LoginButton").html("Login");
        }
        else {
            userUuid = user.uuid;
            userName = user.name;
            localStorage.setItem("userId",userUuid);
            localStorage.setItem("userName",userName);
            $("#LoginButton").html("Logout");
        }        
    }

    //return client data api
    return {
        //User methods
        unsetUser: function() {
            var result = userUuid!="" && userUuid!=undefined;
            setUser(null);
            var token = localStorage.getItem("token");
            if (token!=null) {
                ZzishContent.logout(token);
            }            
            return result;
        },
        getUser: function () {
            return userUuid;
        },
        setUser: function (user,classcode) {
            setUser(user);

        },
        loadPlayerQuizzes: function(callback) {
            ZzishContent.init(initToken);
            ZzishContent.loadAssignedQuizzes(userUuid,function(err,message) {

            })
        },
        loginUser: function(user,classcode,callback) {
            ZzishContent.init(initToken);
        },
        showMessage : function(title,message,callBack) {            
            if (callBack!=null) {
                var uuidGen = uuid.v4();    
                $("#modalUuid").val(uuidGen);
                callbacks[uuidGen]=callBack;
            }
            else {
                $("#modalUuid").val("");
            }
            $("#modalTitle").html(title);
            $("#closeButton").hide();
            $("#modalMessage").html(message);
            $("#closeButton").html("OK");
            $("#messageButton").click();                
        },
        confirmWithUser : function(title,message,callBack) {
            var uuidGen = uuid.v4();
            $("#modalUuid").val(uuidGen);
            callbacks[uuidGen]=callBack;
            $("#modalTitle").html(title);
            $("#closeButton").show();
            $("#modalMessage").html(message);
            $("#closeButton").html("No");
            $("#confirmButton").html("Yes");            
            $("#messageButton").click();                
        },
        confirmed: function(uuid) {
            if (uuid!=undefined && uuid!="" && callbacks[uuid]!=undefined) {
                var x = callbacks[uuid];
                delete callbacks[uuid];
                x();
            }
        }        
    };
}]);
