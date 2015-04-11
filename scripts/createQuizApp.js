var attachFastClick = require('fastclick');

angular.module('createQuizApp', ['ngRoute', 'ngAnimate']);

require('createQuizApp/config/routing');
require('createQuizApp/config/logProvider');

require('factories/QuizData');

require('directives/onEnter');
require('directives/onTab');

require('controllers/CreateController');
require('controllers/DeleteController');
require('controllers/NavBarController');
require('controllers/PreviewController');
require('controllers/QuizzesController');


angular.module('createQuizApp').run(["$rootScope", "$anchorScroll", function ($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", $anchorScroll);
    attachFastClick(document.body);
}]);
