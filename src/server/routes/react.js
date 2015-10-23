/* @flow */
import { renderToString } from 'react-dom/server';
import { match, RoutingContext } from 'react-router';
import routes from './../../client/createQuizApp/config/routesReact';
export let reactRender = function(req, res) {

    match({ routes, location: req.url }, (error, redirectLocation, renderProps) => {
        console.log('aaaahhhh', req.url, error, redirectLocation, renderProps);
        if (error) {
            res.send(500, error.message);
        } else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        } else if (renderProps) {
            console.log('we got...', renderProps);
            res.send(200, renderToString(<RoutingContext {...renderProps} />));
        } else {
            res.send(404, 'Not found')
        }
    });

    var session = req.session;
    if (req.session.token) {
        //validate token
        zzish.getCurrentUser(req.session.token, function(err, data){
            var user = {};
            if (!err && typeof data === 'object') {
                user = data;
            }
            else {
                req.session.token = null;
                req.session.user = null;
            }
            loadUser(res, user);
        });
    }
    else {
        loadUser(res, session.user || {});
    }
};
