import React from 'react';
import { Route } from 'react-router';

var pagesArray          = require('./routes').pagesArray;
var pagesArray          = require('./routes').pagesArray;
var settings            = require('./settings');
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

export default paths;
