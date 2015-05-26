// var React = require('react');
// var CQDashboard = require('createQuizApp/components/CQDashboard');

angular.module('createQuizApp')
  .controller('DashboardController', function(QuizData, $log, $http, $location, $scope){

        var self = this;

        // var renderReactComponent = function(){
        //     React.render(
        //         React.createElement(CQDashboard, {}),
        //         document.getElementById('reactContainer')
        //     );
        // };
        //
        //
        // var addReactComponent = function(){
        //
        //     setTimeout(renderReactComponent, 200);
        //
        //     $scope.$on('$destroy', function(){
        //         React.unmountComponentAtNode(document.getElementById('reactContainer'));
        //     });
        //
        // };
        //
        // addReactComponent();

        self.createQuiz = function() {
            if (!QuizData.getUser()) {
                $location.path('/register/create');
            }
            else {
                $location.path('/create');
            }
        };

    });
