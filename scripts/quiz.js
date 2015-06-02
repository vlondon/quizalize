var token;
//var initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://","baseUrl": "localhost:8080/zzishapi/api/", "webUrl": "http://localhost:3000/","logEnabled": true};
var pathArray = location.href.split( '/' );
var protocol = pathArray[0];
var host = pathArray[2];
var url = protocol + '//' + host;

var initParams = "2d14d1984a2e3293bd13aab34c85e2ea";

console.log((function(){
    initParams = {"api": "2d14d1984a2e3293bd13aab34c85e2ea", "protocol": "http://", "baseUrl": "test-api.zzish.com/api/", "webUrl": "http://test.zzish.com/"};
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

window.goToService = goToService;
window.goToApp = goToApp;
window.goToQuiz = goToQuiz;
