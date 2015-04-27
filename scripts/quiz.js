var token;

function login(toggleLogin) {
  var type = "redirect";
  
  var pathArray = location.href.split( '/' );
  var protocol = pathArray[0];
  var host = pathArray[2];
  var url = protocol + '//' + host + "/quiz#/";

  //var initParams = {"api": "98e820e8-77de-4964-8fa9-70434baf2e8b", "protocol": "http://","baseUrl": "localhost:8080/zzishapi/api/", "webUrl": "http://localhost:3000/","header": "X-ApplicationId","headerprefix": "","logEnabled": true};  
  var initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://","baseUrl": "test-api.zzish.com/api/", "webUrl": "http://test.zzish.com/"};
  // var initParams = "2d14d1984a2e3293bd13aab34c85e2ea";  

  var type = "redirect";

  token = localStorage.getItem("zzishtoken");
  var email = localStorage.getItem("emailAddress");
  var classCode = localStorage.getItem("classCode");
  Zzish.init(initParams);
  if (email==null) {
      if (classCode!=null) {
        //unregistered user
        localStorage.clear();
        $("#LoginButton").html("Login with Zzish");
        location.href="/quiz/";        
      }
      else{
        Zzish.login(type,url);  
      }      
  }
  else if (email!=null) {
          localStorage.clear();
          $("#LoginButton").html("Login with Zzish");
          location.href="/quiz/";
  }
  else {
    if (!!toggleLogin) {
      Zzish.logout(token,function(err,message) {
          localStorage.clear();
          $("#LoginButton").html("Login with Zzish");
          location.href="/quiz/";
      });
    }
    else {
      location.href=url;
    }
  }
}

function logout() {
  var url = "http://www.quizalize.com/quiz#/";
  Zzish.init(initParams);

  token = localStorage.getItem("zzishtoken");
  if (token!=null) {
      Zzish.logout(token,function(err,message) {
          localStorage.clear();
          $("#LoginButton").html("Login with Zzish");
          location.href="/quiz/";
      });
  }
  else {
    localStorage.clear();
    location.href="/quiz/";
  }
}

window.login = login;
window.logout = logout;

$( document ).ready(function() {
	var quizData = localStorage.getItem("quizData");
	var emailAddress = localStorage.getItem("emailAddress");
	if (quizData!=undefined) {
		var qj = $.parseJSON(quizData);
		if (qj!=undefined && qj.length>0) {
			$("#myquizzes").show();
		}
		else {
			$("#myquizzes").hide();
		}
		if (emailAddress!=null) {
			$("#LoginButton").html("Logout");
		}
	}
	else {
		$("#myquizzes").hide();
	}
});
