/* @flow */
var history;
if (typeof window !== 'undefined'){
    history = require('./history');
} else {
    history = {
        replaceState: function(){},
        pushState: function(){},
        goBack: function(){}
    };
};

var router = {
    setRoute(url: string, replaceState: boolean = false){
        if (replaceState){
            history.replaceState({}, url);
        } else {
            history.pushState({}, url);
        }
    },
    getRoute() : Array<string> {
        var route = document.location.pathname.split('/');
        route.shift();
        console.trace('should return the url', document.location.pathname.split('/'), route);
        return route;
    },
    goBack() {
        history.goBack();
    }
};
module.exports = router;
// export default router;
