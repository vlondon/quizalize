/* @flow */
import history from './history';

var router = {
    setRoute(url: string, replaceState: boolean = true){
        console.log('setting route', history, url);
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
    }
};
module.exports = router;
// export default router;
