angular.module('createQuizApp').directive('onEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            console.log(event);
            if(event.which === 13 && event.ctrlKey==false) {
                scope.$apply(function (){
                    scope.$eval(attrs.onEnter);
                });
                event.preventDefault();
            }
        });
    };
});
