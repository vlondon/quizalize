var token;
//var initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://","baseUrl": "localhost:8080/zzishapi/api/", "webUrl": "http://localhost:3000/","logEnabled": true};
var pathArray = location.href.split( '/' );
var protocol = pathArray[0];
var host = pathArray[2];
var url = protocol + '//' + host;

var initParams = "2d14d1984a2e3293bd13aab34c85e2ea";

console.log(function(){
    initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://", "baseUrl": "test-api.zzish.com/api/", "webUrl": "http://test.zzish.com/"};
    return 'Quizalize set to TEST mode';
});

if (initParams.webUrl !== undefined && initParams.webUrl.indexOf("http://test") === 0) {
  url = "http://test.quizalize.com/";
}

Zzish.init(initParams);

function login(postfix) {
  var type = "redirect"; //can be a popup instead

  //represents a user (that may be a zzish login)
  var userId = localStorage.getItem("userId");
  if (userId==null) {
    //assume no token
    localStorage.removeItem("token");
    Zzish.login(type,url+postfix);
  }
  else {
    //just go to the logged in url
    location.href=url+postfix;
  }
}

function logout(postfix) {
  token = localStorage.getItem("token");
  $("#LoginButton").attr("href","/quiz#/login");
  if (token!=null) {
    Zzish.logout(token,function(err,message) {
        localStorage.clear();
        if (postfix!=undefined)
          location.href=postfix;
    });
  }
  else {
    localStorage.clear();
    if (postfix!=undefined)
      location.href=postfix;
  }
}

function goToQuiz() {
  window.location.href="/quiz#/"
}

function goToService() {
  location.hash ="#service";
}

function goToApp() {
  window.location.href="/app#/"
}

window.goToService = goToService;
window.goToApp = goToApp;
window.goToQuiz = goToQuiz;
window.login = login;
window.logout = logout;
