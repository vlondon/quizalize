
//Note that unlike the enter key this does not prevent default:
// in our usage we merely want to inform users on press not change UI behaviour
angular.module('createQuizApp').directive('onTab', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 9) {
                scope.$apply(function (){
                    scope.$eval(attrs.onTab);
                });
            }
        });
    };
});
