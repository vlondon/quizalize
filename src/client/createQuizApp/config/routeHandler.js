/* @flow */
import { Router, Route, Link } from 'react-router';
import MeStore from './../stores/MeStore';
import React from 'react';
import history from './history';
var router              = require('./router');
var pages               = require('./routes').pages;
var pagesArray          = require('./routes').pagesArray;
var settings            = require('./settings');
var AnalyticsActions    = require('./../actions/AnalyticsActions');

import UserStore        from './../stores/UserStore';

var urlParams           = require('./../utils/urlParams');

var CQProfile           = require('./../components/pages/CQProfile');

var requireAuth = function(nextState, replaceState) {
    var params = urlParams();
    //                 if (params.redirect){
    //                     return window.decodeURIComponent(params.redirect);
    //                 } else {
    //
    //                     return settings.defaultLoggedPage;
    //                 }
    var url =  '/quiz/register?redirect=' + window.encodeURIComponent(nextState.location.pathname);
    console.log('requireAuth nextState', MeStore.isLoggedIn(), nextState);
    // var url =  '/quiz/register';
    if (MeStore.isLoggedIn() === false) {
        replaceState({ nextPathname: nextState.location.pathname }, url);
    }
};

var notRequireAuth = function(nextState, replaceState){
    var params = urlParams();
    var url =  '/quiz/register?redirect=' + window.encodeURIComponent(nextState.location.pathname);
    // var url =  '/quiz/register';
    console.log('notRequireAuth nextState', MeStore.isLoggedIn(), url);
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


console.log('paths', paths);


var user = null;
var routerReady = false;
//
// var renderPage = (page, properties) => {
//     properties = properties || {};
//     // properties.getParams = urlParamsToObject(window.location.search) || {};
//     page.renderer(properties);
// };
//
// /// Set routing and parameters
//
// // Set path parameters
// Object.keys(pages.pathParams).map( (param) => router.param(param, pages.pathParams[param]) );
//
//
// // Public pages
// pagesArray.forEach(function(p) {
//     router.on(p.path, p.renderer);
// });
//
//
// var newUrl = function(requestedUrl){
//
//     // return requestedUrl;
//     var getPage = function(url){
//         var arrayPages: Array<Object> = Object.keys(pages).map((key) => pages[key]);
//         var newPage = arrayPages.filter( (p)=> {
//             if (p.pathRegEx) {
//                 return p.pathRegEx.test(url);
//             } else {
//                 return p.path === url;
//             }
//         });
//         return newPage[0];
//     };
//
//     var page = getPage(requestedUrl);
//     if (page) {
//         if (page.needsLogin === undefined){
//             return requestedUrl;
//         }
//         console.log('we are logged in?', user);
//         if (!page.needsLogin) {
//             if (UserStore.isLoggedIn()) {
//                 var params = urlParams();
//                 if (params.redirect){
//                     return window.decodeURIComponent(params.redirect);
//                 } else {
//                     return settings.defaultLoggedPage;
//                 }
//
//             } else {
//                 return requestedUrl;
//             }
//
//             //just got to page if you;re not logged in. UserActions.login will handle redirectUrl
//             // return requestedUrl;
//         } else if(page.needsLogin) {
//             if (UserStore.isLoggedIn()){
//                 return requestedUrl;
//             } else {
//                 return '/quiz/register?redirect=' + window.encodeURIComponent(requestedUrl);
//             }
//         }
//     }
//
//     // return undefined;
// };
//
//
// var options = {
//     async: true,
//     html5history: true,
//     strict: false,
//     notfound: function(){
//         console.warn('Page not found', router.getPath());
//         renderPage(pages.pageNotFound);
//     },
//     after: function(next){
//         AnalyticsActions.trackPageView();
//         next();
//         window.scrollTo(0,0);
//     },
//     before: function(){
//         var destinationURL = newUrl(router.getPath());
//         if (destinationURL === router.getPath()) {
//             var next = arguments[arguments.length - 1];
//             if (next) { next(); }
//         } else if (destinationURL) {
//             if (routerReady) {
//                 router.setRoute(destinationURL);
//             } else {
//                 // we have to us a timeout
//                 // https://github.com/flatiron/director/pull/280
//                 setTimeout(()=>{
//                     console.warn('Delayed redirect (onInit)');
//                     router.setRoute(destinationURL);
//                 }, 550);
//             }
//
//         } else {
//             console.error('something needs to change to handle this state', this, router);
//             pages.pageNotFound.renderer();
//
//         }
//     }
// };
//
//

if (routerReady !== true) {
    // router.init();
    React.render(<Router routes={paths} history={history}/>, document.getElementById('reactApp'));
    routerReady = true;
}
// // // Add user listener
// UserStore.addChangeListener(function(){
//     // } else {
//         // options.before();
//     }
//
// });

// Initialize router
// router.configure(options);
// Request user status

module.exports = router;
