var UserActions = {};

angular.module('createQuizApp')
    .factory('UserActions', function(QuizData){
        UserActions.status = function () {
            console.log('status', QuizData);
        };

        return UserActions;
    });

console.log('UserActions', UserActions);
module.export = UserActions;
