/* @flow */
var defaultSettings = {
    apiDomain: '/',
    defaultLoggedPage: '/quiz/quizzes',
    type: 'quiz'
};

var settings = Object.assign(defaultSettings, {});

// // fixing types
console.log((function(){

    if (document){
        (function(d, script) {
            script = d.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function(){
                // remote script has loaded
            };
            script.src = 'http://localhost:7071/webpack-dev-server.js';
            // d.getElementsByTagName('head')[0].appendChild(script);
        }(document));
        return 'Setting environment for development';
    }

})());


module.exports = settings;
