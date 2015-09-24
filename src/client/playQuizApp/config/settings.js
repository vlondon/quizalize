/* @flow */
var assign = require('object-assign');

var defaultSettings = {
    apiDomain: '/',
    defaultLoggedPage: '/play/list',
    type: 'quiz'
};

var settings = assign(defaultSettings, {});

// // fixing types
console.log((function(){
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
})());


module.exports = settings;
