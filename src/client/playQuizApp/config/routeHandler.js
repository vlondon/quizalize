/* @flow */

var router              = require('./router');
var pages               = require('./routes').pages;
var pagesArray          = require('./routes').pagesArray;
var settings            = require('./settings');
// var AnalyticsActions    = require('./../actions/AnalyticsActions');

// import UserStore        from './../stores/UserStore';
var UserStore           = require('./../stores/PQUserStore');


var urlParams           = require('./../../createQuizApp/utils/urlParams');

var user = null;
var routerReady = false;

var renderPage = (page, properties) => {
    properties = properties || {};
    // properties.getParams = urlParams();
    page.renderer(properties);
};

/// Set routing and parameters

// Set path parameters
Object.keys(pages.pathParams).map( (param) => router.param(param, pages.pathParams[param]) );


// Public pages
pagesArray.forEach(function(p) {
    router.on(p.path, p.renderer);
});


var newUrl = function(requestedUrl){

    // return requestedUrl;
    var getPage = function(url){
        var arrayPages: Array<Object> = Object.keys(pages).map((key) => pages[key]);
        console.log('url?', arrayPages);
        var newPage = arrayPages.filter( (p)=> {
            if (p.pathRegEx) {
                return p.pathRegEx.test(url);
            } else {
                return p.path === url;
            }
        });
        return newPage[0];
    };

    var page = getPage(requestedUrl);
    if (page) {
        if (page.needsLogin === undefined){
            return requestedUrl;
        }
        console.log('we are logged in?', user);
        if (!page.needsLogin) {
            if (UserStore.isLoggedIn() && !page.public) {
                var params = urlParams();
                if (params.redirect){
                    window.location = window.decodeURIComponent(params.redirect);
                    return true;
                } else {

                    return settings.defaultLoggedPage;
                }

            } else {
                return requestedUrl;
            }
        } else if(page.needsLogin) {
            if (typeof user === 'object'){
                return requestedUrl;
            } else {
                return '/quiz/register?redirect=' + window.encodeURIComponent(requestedUrl);
            }
        }
    }

    // return undefined;
};


var options = {
    async: true,
    html5history: true,
    strict: false,
    notfound: function(){
        console.warn('Page not found', router.getPath());
        renderPage(pages.pageNotFound);
    },
    after: function(next){
        // console.log('AnalyticsActions', AnalyticsActions);
        // AnalyticsActions.trackPageView();
        next();
    },
    before: function(){
        var destinationURL = newUrl(router.getPath());
        if (destinationURL === router.getPath()) {
            var next = arguments[arguments.length - 1];
            if (next) { next(); }
        } else if (destinationURL) {
            if (routerReady) {
                router.setRoute(destinationURL);
            } else {
                // we have to us a timeout
                // https://github.com/flatiron/director/pull/280
                setTimeout(()=>{
                    console.warn('Delayed redirect (onInit)');
                    router.setRoute(destinationURL);
                }, 550);
            }

        } else {
            console.error('something needs to change to handle this state', this, router);
            pages.pageNotFound.renderer();

        }
    }
};


// Add user listener
// UserStore.addChangeListener(function(){
//     user = UserStore.getUser();
//
// });

// Initialize router
router.configure(options);
if (routerReady !== true) {
    router.init();
    routerReady = true;
} else {
    options.before();
}
// Request user status

module.exports = router;
