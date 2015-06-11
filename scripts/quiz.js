var token;
var initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://","baseUrl": "localhost:8080/zzishapi/api/", "webUrl": "http://localhost:3000/","logEnabled": true};
var pathArray = location.href.split( '/' );
var protocol = pathArray[0];
var host = pathArray[2];
var url = protocol + '//' + host;

//var initParams = "2d14d1984a2e3293bd13aab34c85e2ea";

console.log((function(){
    //initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://", "baseUrl": "test-api.zzish.com/api/", "webUrl": "http://test.zzish.com/"};
    return 'Quizalize set to TEST mode';
})());

if (initParams.webUrl !== undefined && initParams.webUrl.indexOf("http://test") === 0) {
  url = "http://test.quizalize.com/";
}

Zzish.init(initParams);


function goToQuiz() {
  window.location.href="/quiz#/"
}

function goToService() {
  location.hash ="#service";
}

function goToApp() {
  window.location.href="/app#/"
}


function showQuiz(id) {
    var check = localStorage.getItem("userId") || localStorage.getItem('token');
    var quizUrl = window.location.href = "/app#/play/public/" + id;
    if (!check) {
        quizUrl = "/quiz/register?redirect=" + window.encodeURIComponent(quizUrl);
    }
    window.location.href = quizUrl;
}



function login (){
    var options = {
            classcode: 1,
            optionstoshow: ';student;teacher;',
            redirectURL: url + '/app#/list',
            verify: 1
        };
    var type = "redirect"; //can be a popup instead

    //represents a user (that may be a zzish login)
    var userId = localStorage.getItem("userId");
    if (userId === null) {
        //assume no token
        localStorage.removeItem("token");
        Zzish.login(type, options);
    }
    else {
        //just go to the logged in url
        location.href = url + '/app#/list';
    }
}

window.goToService = goToService;
window.goToApp = goToApp;
window.goToQuiz = goToQuiz;
window.showQuiz = showQuiz;
window.login = login;
