/* @flow */
var React               = require('react');

// var settings        = require('utils/settings');

var CQMarketplace           = require('./../components/pages/CQMarketplace');
var CQProfile               = require('./../components/pages/CQProfile');
var CQProfileSlug           = require('./../components/pages/CQProfile/CQProfileSlug');
var CQOwnProfile            = require('./../components/pages/CQProfile/CQOwnProfile');
var CQNotFound              = require('./../components/pages/CQNotFound');
var CQLogin                 = require('./../components/pages/CQLogin');
var CQRegister              = require('./../components/pages/CQRegister');
var CQRecoverPassword       = require('./../components/pages/CQRecoverPassword');
var CQRestorePassword       = require('./../components/pages/CQRestorePassword');
var CQRedirect              = require('./../components/pages/CQRedirect');
var CQQuizzes               = require('./../components/pages/CQQuizzes');
var CQCreate                = require('./../components/pages/CQCreate');
var CQReview                = require('./../components/pages/CQReview');
var CQEdit                  = require('./../components/pages/CQEdit');
var CQAssignments           = require('./../components/pages/CQAssignments');
var CQPublished             = require('./../components/pages/CQPublished');
var CQPublishedPublished    = require('./../components/pages/CQPublished/CQPublishedPublished');
var CQPublishedAssign       = require('./../components/pages/CQPublished/CQPublishedAssign');
var CQPublishedShare        = require('./../components/pages/CQPublished/CQPublishedShare');
var CQPublishedInfo         = require('./../components/pages/CQPublishedInfo');
var CQSettings              = require('./../components/pages/CQSettings');
var CQApp                   = require('./../components/pages/CQApp');
var CQYourApps              = require('./../components/pages/CQYourApps');
var CQAssignQuiz            = require('./../components/pages/CQAssignQuiz');

export type Page = {
    name: string;
    path: string;
    pathRegEx?: Object;
    needsLogin: ?boolean;
    renderer?: Function;
    component: Object;
}

var pagesArray: Array<Page> = [
    {
        name: 'mainPage',
        path: '/quiz',
        needsLogin: undefined,
        component: CQOwnProfile,
        renderer: function(){
            React.render(
                React.createElement(CQProfile, null),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'ownProfilePage',
        path: '/quiz/user',
        needsLogin: true,
        component: CQOwnProfile,
        renderer: function(){
            React.render(
                React.createElement(CQOwnProfile),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'profileUrlPage',
        path: '/profile/:profileUrl',
        pathRegEx: /\/profile\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQProfileSlug,
        renderer: function(profileUrl: string){
            React.render(
                React.createElement(CQProfileSlug, {profileUrl}),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'profilePage',
        path: '/quiz/user/:profileId',
        pathRegEx: /\/quiz\/user\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQProfile,
        renderer: function(profileId: string){
            React.render(
                React.createElement(CQProfile, {profileId}),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'sharedQuizPage',
        path: '/quiz/user/:profileId/:quizCode',
        pathRegEx: /\/quiz\/\/user\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQProfile,
        renderer: function(profileId: string, quizCode: string){
            React.render(
                React.createElement(CQProfile, {profileId, quizCode}),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'settingsPage',
        path: '/quiz/settings',
        needsLogin: true,
        component: CQSettings,
        renderer: function(){
            React.render(
                React.createElement(CQSettings, null),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'publicPage',
        path: '/quiz/marketplace',
        needsLogin: undefined,
        component: CQMarketplace,
        renderer: function(){
            React.render(
                React.createElement(CQMarketplace, null),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'publicMarketplacePage',
        path: '/quiz/lmarketplace',
        needsLogin: true,
        component: CQMarketplace,
        renderer: function(){
            React.render(
                React.createElement(CQMarketplace, null),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'loginPage',
        path: '/quiz/login',
        needsLogin: false,
        component: CQLogin,
        renderer: function(){
            React.render(
                React.createElement(CQLogin, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'registerPage',
        path: '/quiz/register',
        needsLogin: false,
        component: CQRegister,
        renderer: function(){
            React.render(
                React.createElement(CQRegister, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'registerAndCreatePage',
        path: '/quiz/register/create',
        needsLogin: false,
        component: CQRegister,
        renderer: function(){
            React.render(
                React.createElement(CQRegister, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'recoverPassword',
        path: '/quiz/recover',
        needsLogin: false,
        component: CQRecoverPassword,
        renderer: function(){
            React.render(
                React.createElement(CQRecoverPassword, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'restorePassword',
        path: '/quiz/reset/:code',
        pathRegEx: /\/quiz\/reset\/([\w\-]+)/,
        needsLogin: false,
        component: CQRestorePassword,
        renderer: function(code:string){
            React.render(
                React.createElement(CQRestorePassword, {code}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'yourApps',
        path: '/quiz/apps',
        needsLogin: true,
        component: CQYourApps,
        renderer: function(){
            React.render(
                React.createElement(CQYourApps, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'yourAppsEdit',
        path: '/quiz/apps/:appId',
        pathRegEx: /\/quiz\/apps\/([\w\-]+)/,
        needsLogin: true,
        component: CQYourApps,
        renderer: function(appId: string){
            React.render(
                React.createElement(CQYourApps, {appId}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'quizzes',
        path: '/quiz/quizzes',
        needsLogin: true,
        component: CQOwnProfile,
        renderer: function(){
            React.render(
                React.createElement(CQQuizzes, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'quizzesShare',
        path: '/quiz/quizzes/s/:quizCode',
        pathRegEx: /\/quiz\/quizzes\/s\/([\w\-]+)/,
        needsLogin: true,
        component: CQOwnProfile,
        renderer: function(quizCode){
            React.render(
                React.createElement(CQQuizzes, {quizCode}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'redirect',
        path: '/quiz/playh/:redirectURL',
        pathRegEx: /\/quiz\/playh\/([\w\-]+)/,
        needsLogin: true,
        component: CQRedirect,
        renderer: function(redirectURL: string){
            React.render(
                React.createElement(CQRedirect, {redirectURL}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'create',
        path: '/quiz/create',
        needsLogin: true,
        component: CQEdit,
        renderer: function(){
            React.render(
                React.createElement(CQEdit, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'editQuiz',
        path: '/quiz/edit/:quizId',
        pathRegEx: /\/quiz\/edit\/([\w\-]+)/,
        needsLogin: true,
        component: CQCreate,
        renderer: function(quizId: string){
            React.render(
                React.createElement(CQCreate, {quizId}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'reviewQuiz',
        path: '/quiz/review/:quizId',
        pathRegEx: /\/quiz\/review\/([\w\-]+)/,
        needsLogin: true,
        component: CQReview,
        renderer: function(quizId: string){
            React.render(
                React.createElement(CQReview, {quizId}),
                document.getElementById('reactApp')
            );
        }
    },


    {
        name: 'edit',
        path: '/quiz/create/:quizId',
        pathRegEx: /\/quiz\/create\/([\w\-]+)/,
        needsLogin: true,
        component: CQEdit,
        renderer: function(quizId: string){
            React.render(
                React.createElement(CQEdit, {quizId}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'editQuestion',
        path: '/quiz/create/:quizId/:questionIndex',
        pathRegEx: /\/quiz\/create\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: true,
        component: CQEdit,
        renderer: function(quizId: string, questionIndex: string){
            React.render(
                React.createElement(CQEdit, {quizId, questionIndex}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'assignments',
        path: '/quiz/assignments',
        needsLogin: true,
        component: CQAssignments,
        renderer: function(){
            React.render(
                React.createElement(CQAssignments, null),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'multi',
        path: '/quiz/multi/:quizId',
        pathRegEx: /\/quiz\/multi\/([\w\-]+)/,
        needsLogin: true,
        component: CQAssignQuiz,
        renderer: function(marketplaceQuizId: string){
            React.render(
                React.createElement(CQAssignQuiz, {marketplaceQuizId}),
                document.getElementById('reactApp')
            );
        }
    },


    {
        name: 'published',
        path: '/quiz/published/:quizId',
        pathRegEx: /\/quiz\/published\/([\w\-]+)/,
        needsLogin: true,
        component: CQPublished,
        renderer: function(quizId: string){
            React.render(
                React.createElement(CQPublished, {quizId}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'publishedAssign',
        path: '/quiz/published/:quizId/assign',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/assign/,
        needsLogin: true,
        component: CQPublishedAssign
    },

    {
        name: 'publishedShare',
        path: '/quiz/published/:quizId/share',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/share/,
        needsLogin: true,
        component: CQPublishedShare
    },

    {
        name: 'publishedPricing',
        path: '/quiz/published/:quizId/publish',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/assign/,
        needsLogin: true,
        component: CQPublishedPublished,
        renderer: function(quizId: string){
            React.render(
                React.createElement(CQPublishedPublished, {quizId, published: true}),
                document.getElementById('reactApp')
            );
        }
    },


    {
        name: 'publishedInfo',
        path: '/quiz/published/:quizId/:classCode/info',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/([\w\-]+)\/info/,
        needsLogin: true,
        component: CQPublishedInfo,
        renderer: function(quizId: string, classCode: string){
            React.render(
                React.createElement(CQPublishedInfo, {quizId, classCode}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'app',
        path: '/quiz/app/:appId',
        pathRegEx: /\/quiz\/app\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQApp,
        renderer: function(appId: string){
            React.render(
                React.createElement(CQApp, {appId}),
                document.getElementById('reactApp')
            );
        }
    },

    {
        name: 'pageNotFound',
        path: '*',
        needsLogin: false,
        component: CQNotFound,
        renderer: function() {
            React.render(
                React.createElement(CQNotFound, null),
                document.getElementById('reactApp')
            );
        }
    }
];

var pages = {
    pathParams: {
        quizId: /([\w\-]+)/,
        appId: /([\w\-]+)/,
        quizCode: /([\w\-]+)/,
        authorId: /([\w\-]+)/,
        questionIndex: /([\w\-]+)/,
        classCode: /([\w\-]+)/,
        redirectURL: /([\w\-]+)/,
        code: /([\w\-]+)/
    },
    pageNotFound: pagesArray.filter((p) => p.name === 'pageNotFound')[0]

};

pagesArray.forEach( p => {
    pages[p.name] = p;
});

module.exports = { pages, pagesArray };
