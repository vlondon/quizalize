MathJax.Hub.Config({
    extensions: ["tex2jax.js"],
    showProcessingMessages: false,
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
      inlineMath: [ ['$','$'], ["\\(","\\)"] ],
      displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
      processEscapes: true
    },    
    "HTML-CSS": { availableFonts: ["TeX"] }
});
MathJax.Hub.Configured();

angular.module('createQuizApp').directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$rootScope","$scope", "$element", "$attrs", function($rootScope,$scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value,oldvalue) {
                if (!$rootScope.processing && !!$rootScope.latexAtivated && value!=undefined) {
                    $rootScope.processing = true;
                    var test = (value.match(/\$/g) || []).length;
                    if (test%2==0 && test>0) {
                        $element.text(value == undefined ? "" : value);                            
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]],["PreviewDone",this]);                                                                                                    
                    }                        
                }
            });
        }]
    };
});