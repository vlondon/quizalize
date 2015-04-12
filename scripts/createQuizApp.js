var FastClick = require('fastclick');

angular.module('createQuizApp', ['ngRoute', 'ngAnimate']);

require('createQuizApp/config/routing');
require('createQuizApp/config/logProvider');

require('createQuizApp/factories/QuizData');

require('createQuizApp/directives/onEnter');
require('createQuizApp/directives/onTab');

require('createQuizApp/controllers/CreateController');
require('createQuizApp/controllers/DeleteController');
require('createQuizApp/controllers/NavBarController');
require('createQuizApp/controllers/PreviewController');
require('createQuizApp/controllers/QuizzesController');


angular.module('createQuizApp').run(["$rootScope", "$anchorScroll", function ($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", $anchorScroll);
    FastClick.attach(document.body);
}]);
