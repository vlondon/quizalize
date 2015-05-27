var router          = require('./router');
var pages           = require('./routes');
var settings        = require('createQuizApp/flux/config/settings');

var UserStore       = require('createQuizApp/flux/stores/UserStore');
var UserActions     = require('createQuizApp/flux/actions/UserActions');
// var urlParamsToObject   = require('./../utils/urlParamsToObject');

var user = null;
var routerReady = false;

var renderPage = (page, properties) => {
    console.log('page', page, properties);
    properties = properties || {};
    // properties.getParams = urlParamsToObject(window.location.search) || {};
    page.renderer(properties);
};

/// Set routing and parameters

// Set path parameters
// Object.keys(pages.pathParams).map( (param) => router.param(param, pages.pathParams[param]) );

console.log('pages', pages, pages.mainPage.path);
// Public pages
router.on(pages.mainPage.path, () => renderPage(pages.mainPage) );
router.on(pages.loginPage.path, () => renderPage(pages.loginPage) );
router.on(pages.registerPage.path, () => renderPage(pages.registerPage) );
router.on(pages.recoverPassword.path, () => renderPage(pages.recoverPassword) );
router.on(pages.quizzes.path, () => renderPage(pages.quizzes) );
//
// // Private pages
// router.on(pages.quizPageWithCategory.path, (category) => renderPage(pages.quizPageWithCategory, { category }) );
// router.on(pages.assessmentsPage.path, () => renderPage(pages.assessmentsPage) );
// router.on(pages.myResultsPage.path, () => renderPage(pages.myResultsPage) );
// router.on(pages.mySettingsPage.path, () => renderPage(pages.mySettingsPage) );

// Only by link available pages
// router.on(pages.talentPassportPage.path, (userid) => renderPage(pages.talentPassportPage, { userid }) );

/// Discover url needed


var newUrl = function(requestedUrl){

    // return requestedUrl;
    var getPage = function(url){
        var arrayPages = Object.keys(pages).map((key) => pages[key]);
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
        if (!page.needsLogin) {
            if (typeof user === 'object' && !page.public) {
                return settings.defaultLoggedPage;
            } else {
                return requestedUrl;
            }
        } else if(page.needsLogin) {
            if (typeof user === 'object'){
                return requestedUrl;
            } else {
                return '/quiz/login';
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
        console.log('not found?', router.getPath(), pages.pageNotFound);
        renderPage(pages.pageNotFound);
    },
    before: function(){
        console.log('path?', router.getPath());
        var destinationURL = newUrl(router.getPath());

        if (destinationURL === router.getPath()) {
            var next = arguments[arguments.length - 1];
            next();
        } else if (destinationURL) {
            if (routerReady) {
                router.setRoute(destinationURL);
            } else {
                // we have to us a timeout
                // https://github.com/flatiron/director/pull/280
                setTimeout(()=>{
                    console.log('Delayed redirect (onInit)');
                    router.setRoute(destinationURL);
                }, 550);
            }

        } else {
            console.error('something needs to change to handle this state', this, router);
            //
            pages.pageNotFound.render();

        }
    }
};


// Add user listener
UserStore.addChangeListener(function(){
    user = UserStore.getUser();
    console.log('*** User Changed *** ', user, routerReady);
    if (routerReady !== true) {

        router.init();
        routerReady = true;
    }
});

/// Initialize router
router.configure(options);
// Request user status
UserActions.request();

module.exports = router;
