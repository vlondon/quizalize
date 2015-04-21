var token;

function login(toggleLogin) {
  var type = "redirect";
  var url = "http://www.quizalize.com/quiz#/";
  Zzish.init("2d14d1984a2e3293bd13aab34c85e2ea");


  token = localStorage.getItem("zzishtoken");
  email = localStorage.getItem("emailAddress");
  if (token==null && email==null) {
      Zzish.login(type,url);
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
  Zzish.init("2d14d1984a2e3293bd13aab34c85e2ea");

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
