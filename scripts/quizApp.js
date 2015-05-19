//TODO Put this somewhere sensible

var FastClick = require('fastclick');

// Angular is global and already defined in vendor.js
angular.module('quizApp', ['ngRoute', 'ngAnimate']);

require('quizApp/config/routing');
require('quizApp/config/logProvider');

require('quizApp/factories/QuizData');

require('quizApp/controllers/NavBarController');
require('quizApp/controllers/StartController');
require('quizApp/controllers/LoginController');
require('quizApp/controllers/PublicController');
require('quizApp/controllers/GameController');
require('quizApp/controllers/PreviewController');
require('quizApp/controllers/QuizzesController');
require('quizApp/controllers/QuizController');
require('quizApp/controllers/MultipleController');
require('quizApp/controllers/ScrambledController');
require('quizApp/controllers/AnswerController');
require('quizApp/controllers/CompleteController');

require('quizApp/filters/OrderByObject');

angular.module('quizApp').run(function() {
    FastClick.attach(document.body);

});

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
