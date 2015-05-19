angular.module('quizApp')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider
        .when('/', {
            templateUrl: "/quiz/view/index",
            controller: "StartController",
            controllerAs: "start"
        })
        .when('/class', {
            templateUrl: "/quiz/view/plogin",
            controller: "LoginController",
            controllerAs: "login"
        })        
        .when('/list', {
            templateUrl: "/quiz/view/studentCategoryList",
            controller: "QuizzesController",
            controllerAs: "quizzes"
        })
        .when('/public', {
            templateUrl: "/quiz/view/studentCategoryList",
            controller: "PublicController",
            controllerAs: "quizzes"
        })
        .when('/play/:catId/:id/:action', {
            templateUrl: "/quiz/view/intro",
            controller: "GameController",
            controllerAs: "quiz"
        })
        .when('/quiz/:catId/:quizId/multiple/:questionId', {
            templateUrl: "/quiz/view/multiple",
            controller: "MultipleController",
            controllerAs: "quiz"
        })
        .when('/quiz/:catId/:quizId/scrambled/:questionId', {
            templateUrl: "/quiz/view/scrambled",
            controller: "ScrambledController",
            controllerAs: "quiz"
        })
        .when('/quiz/:catId/:quizId/answer/:questionId', {
            templateUrl: "/quiz/view/answer",
            controller: "AnswerController",
            controllerAs: "quiz"
        })
        .when('/quiz/:catId/:quizId/complete' ,{
            templateUrl: "/quiz/view/complete",
            controller: "CompleteController",
            controllerAs: "quiz"
        })
        .when('/preview/:id' ,{
            templateUrl: "/quiz/view/intro",
            controller: "PreviewController",
            controllerAs: "quiz"
        })        
        .when('/mp/:id' ,{
            templateUrl: "/quiz/view/app",
            controller: "MarketController",
            controllerAs: "market"
        })           
        .otherwise({redirectTo: '/'})
}]);
