/* @flow */
import history from './history';

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
        return route;
    },
    goBack() {
        history.goBack();
    }
};
module.exports = router;
// export default router;
