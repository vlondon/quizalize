angular.module('createQuizApp')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "/quiz/view/dashboard",
            controller: "DashboardController",
            controllerAs: "dashboard"
        })
        .when('/quizzes', {
            templateUrl: "/quiz/view/quizzes",
            controller: "QuizzesController",
            controllerAs: "quizzes"
        })
        .when('/assignments', {
            templateUrl: "/quiz/view/assignments",
            controller: "AssignmentsController",
            controllerAs: "quizzes"
        })
        .when('/share/:code', {
            templateUrl: "/quiz/view/share",
            controller: "ShareController",
            controllerAs: "share"
        })
        .when('/register/:postAction', {
            templateUrl: "/quiz/view/register",
            controller: "RegisterController",
            controllerAs: "register"
        }) 
        .when('/success/:postAction/:id', {
            templateUrl: "/quiz/view/registered",
            controller: "RegisteredController",
            controllerAs: "registered"
        }) 
        .when('/create', {
            templateUrl: "/quiz/view/createq",
            controller: "CreateQuizController",
            controllerAs: "ctrl"
        }) 
        .when('/edit/:id', {
            templateUrl: "/quiz/view/createq",
            controller: "CreateQuizController",
            controllerAs: "ctrl"
        }) 
        .when('/login', {
            templateUrl: "/quiz/view/login",
            controller: "LoginController",
            controllerAs: "login"
        }) 
        .when('/account/:command/:id', {
            templateUrl: "/quiz/view/account",
            controller: "AccountController",
            controllerAs: "account"
        })  
        .when('/public', {
            templateUrl: "/quiz/view/public",
            controller: "PublicController",
            controllerAs: "public"
        })        
        .when('/create/:id', {
            templateUrl: "/quiz/view/create",
            controller: "CreateController",
            controllerAs: "create"
        })
        .when('/preview/:id', {
            templateUrl: "/quiz/view/preview",
            controller: "PreviewController",
            controllerAs: "ctrl"
        })
        .when('/published/:id/:action', {
            templateUrl: "/quiz/view/published",
            controller: "PublishedController",
            controllerAs: "ctrl"
        })
        .when('/delete/:id', {
            templateUrl: "/quiz/view/quizzes",
            controller: "DeleteController",
            controllerAs: "delete"
        })
        .when('/assign/:id', {
            templateUrl: "/quiz/view/quizzes",
            controller: "AssignController",
            controllerAs: "delete"
        })
        .when('/passign/:id', {
            templateUrl: "/quiz/view/quizzes",
            controller: "PublicAssignController",
            controllerAs: "assign"
        })
        .when('/playh/:postAction/:id', {
            templateUrl: "/quiz/view/signup",
            controller: "SignupController",
            controllerAs: "signup"
        })  
        .when('/pquizzes', {
            templateUrl: "/quiz/view/pquizzes",
            controller: "PublicQuizzesController",
            controllerAs: "pquizzes"
        })       
        .otherwise({redirectTo: '/'})
}]);
