/* @flow */
import { Router, Route } from 'react-router';
import history from './history';
import MeStore from './../stores/MeStore';
import React from 'react';

var router              = require('./router');

var pagesArray          = require('./routes').pagesArray;
var settings            = require('./settings');
var AnalyticsActions    = require('./../actions/AnalyticsActions');

var urlParams           = require('./../utils/urlParams');

var requireAuth = function(nextState, replaceState) {

    var url =  '/quiz/register?redirect=' + window.encodeURIComponent(nextState.location.pathname);
    console.log('requireAuth nextState', MeStore.isLoggedIn(), nextState);
    // var url =  '/quiz/register';
    if (MeStore.isLoggedIn() === false) {
        replaceState({ nextPathname: nextState.location.pathname }, url);
    }
};

var notRequireAuth = function(nextState, replaceState){
    var params = urlParams();
    let url;
    if (params.redirect){
        url = window.decodeURIComponent(params.redirect);
    } else {
        url = settings.defaultLoggedPage;
    }

    if (MeStore.isLoggedIn() === true) {
        replaceState({ nextPathname: nextState.location.pathname }, url);
    }
};

const paths = pagesArray.map(page => {
    let component;
    if (page.needsLogin === true) {
        component = (<Route path={page.path} component={page.component} onEnter={requireAuth}/>);
    } else if (page.needsLogin === false) {
        component = (<Route path={page.path} component={page.component} onEnter={notRequireAuth}/>);
    } else {
        component = (<Route path={page.path} component={page.component}/>);
    }
    return component;
});

// history.listen(AnalyticsActions.trackPageView);
history.listen(function(){
    AnalyticsActions.trackPageView();
    // TODO: Add local analaytics calls here
});

React.render(<Router routes={paths} history={history} />, document.getElementById('reactApp'));


module.exports = router;
