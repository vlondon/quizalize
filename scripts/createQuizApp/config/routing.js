angular.module('createQuizApp')
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: "/quiz/view/quizList",
            controller: "QuizzesController",
            controllerAs: "quizzes"
        })
        .when('/create/:id', {
            templateUrl: "/quiz/view/create",
            controller: "CreateController",
            controllerAs: "create"
        })
        .when('/preview/:id', {
            templateUrl: "/quiz/view/preview",
            controller: "PreviewController",
            controllerAs: "preview"
        })
        .when('/delete/:id', {
            templateUrl: "/quiz/view/quizList",
            controller: "DeleteController",
            controllerAs: "delete"
        })
        .otherwise({redirectTo: '/'})
}])
