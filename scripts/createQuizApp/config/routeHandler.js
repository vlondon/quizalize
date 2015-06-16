var router              = require('./router');
var pages               = require('./routes');
var settings            = require('createQuizApp/config/settings');
var AnalyticsActions    = require('createQuizApp/actions/AnalyticsActions');

var UserStore           = require('createQuizApp/stores/UserStore');
var urlParams           = require('createQuizApp/utils/urlParams');

var user = null;
var routerReady = false;

var renderPage = (page, properties) => {
    properties = properties || {};
    // properties.getParams = urlParamsToObject(window.location.search) || {};
    page.renderer(properties);
};

/// Set routing and parameters

// Set path parameters
Object.keys(pages.pathParams).map( (param) => router.param(param, pages.pathParams[param]) );


// Public pages
router.on(pages.mainPage.path, () => renderPage(pages.mainPage) );
router.on(pages.mainPageWithSlash.path, () => renderPage(pages.mainPageWithSlash) );
router.on(pages.publicPage.path, () => renderPage(pages.publicPage) );
router.on(pages.helpPage.path, () => renderPage(pages.helpPage) );
router.on(pages.settingsPage.path, () => renderPage(pages.settingsPage) );
router.on(pages.loginPage.path, () => renderPage(pages.loginPage) );
router.on(pages.registerPage.path, () => renderPage(pages.registerPage) );
router.on(pages.recoverPassword.path, () => renderPage(pages.recoverPassword) );
router.on(pages.restorePassword.path, (code) => renderPage(pages.restorePassword, {code}) );
router.on(pages.redirect.path, (redirectURL) => renderPage(pages.redirect, {redirectURL}) );
router.on(pages.quizzes.path, () => renderPage(pages.quizzes) );
router.on(pages.create.path, () => renderPage(pages.create) );
router.on(pages.createApp.path, () => renderPage(pages.createApp) );
router.on(pages.editQuiz.path, (quizId) => renderPage(pages.editQuiz, {quizId}) );
router.on(pages.edit.path, (quizId) => renderPage(pages.edit, {quizId}) );
router.on(pages.editQuestion.path, (quizId, questionIndex) => renderPage(pages.editQuestion, {quizId, questionIndex}) );
router.on(pages.assignments.path, () => renderPage(pages.assignments) );
router.on(pages.published.path, (quizId) => renderPage(pages.published, {quizId}) );
router.on(pages.publishedInfo.path, (quizId, classCode) => renderPage(pages.publishedInfo, {quizId, classCode}) );
router.on(pages.app.path, (appId) => renderPage(pages.app, {appId}) );


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
        if (page.needsLogin === undefined){
            console.log('NO NEED TO CHECK IF NEEDS LOGIN OR NOT');
            return requestedUrl;
        }
        if (!page.needsLogin) {
            if (typeof user === 'object' && !page.public) {

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
        AnalyticsActions.trackPageView();
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
UserStore.addChangeListener(function(){
    user = UserStore.getUser();
    if (routerReady !== true) {
        router.init();
        routerReady = true;
    } else {
        options.before();
    }

});

// Initialize router
router.configure(options);
// Request user status

module.exports = router;
