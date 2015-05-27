var assign = require('object-assign');

var defaultSettings = {
    apiDomain: '/',
    defaultLoggedPage: '/quiz/quizzes'
};

var settings = assign(defaultSettings, {});

// // fixing types
console.log((function(){
    return 'Setting environment for development';
})());


module.exports = settings;
