var FastClick = require('fastclick');

angular.module('createQuizApp', ['ngRoute', 'ngAnimate', "chart.js"]);

require('createQuizApp/config/routing');
require('createQuizApp/config/logProvider');

require('createQuizApp/factories/QuizData');

require('createQuizApp/directives/onEnter');
require('createQuizApp/directives/onTab');
require('createQuizApp/directives/MathBind');

require('createQuizApp/controllers/DashboardController');
require('createQuizApp/controllers/AssignmentsController');

require('createQuizApp/controllers/CreateQuizController');
require('createQuizApp/controllers/CreateController');
require('createQuizApp/controllers/RegisterController');
require('createQuizApp/controllers/RegisteredController');
require('createQuizApp/controllers/DeleteController');
require('createQuizApp/controllers/NavBarController');
require('createQuizApp/controllers/PreviewController');
require('createQuizApp/controllers/QuizzesController');
require('createQuizApp/controllers/PublicController');
require('createQuizApp/controllers/AssignController');
require('createQuizApp/controllers/PublicAssignController');
require('createQuizApp/controllers/LoginController');
require('createQuizApp/controllers/AccountController');
require('createQuizApp/controllers/PublishedController');
require('createQuizApp/controllers/ShareController');
require('createQuizApp/controllers/SignupController');
require('createQuizApp/controllers/ResultsController');

require('createQuizApp/filters/OrderByObject');

angular.module('createQuizApp').run(["$rootScope", "$anchorScroll" , function ($rootScope, $anchorScroll) {
    $rootScope.$on("$locationChangeSuccess", function() {
        $anchorScroll();
    });
    FastClick.attach(document.body);
}]);
