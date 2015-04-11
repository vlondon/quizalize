//TODO Put this somewhere sensible

var attachFastClick = require('fastclick');

// Angular is global and already defined in vendor.js
angular.module('quizApp', ['ngRoute', 'ngAnimate']);


require('config/routing');
require('config/logProvider');

require('factories/ZzishContent');
require('factories/QuizData');

require('controllers/StartController');
require('controllers/QuizzesController');
require('controllers/QuizController');
require('controllers/MultipleController');
require('controllers/ScrambledController');
require('controllers/ManualController');
require('controllers/IntroController');
require('controllers/AnswerController');
require('controllers/CompleteController');

angular.module('quizApp').run(function() {
    attachFastClick.attach(document.body);
});
