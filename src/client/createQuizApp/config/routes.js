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

    },
    {
        name: 'ownProfilePage',
        path: '/quiz/user',
        needsLogin: true,
        component: CQOwnProfile,

    },
    {
        name: 'profileUrlPage',
        path: '/profile/:profileUrl',
        pathRegEx: /\/profile\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQProfileSlug,

    },
    {
        name: 'profilePage',
        path: '/quiz/user/:profileId',
        pathRegEx: /\/quiz\/user\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQProfile,

    },
    {
        name: 'sharedQuizPage',
        path: '/quiz/user/:profileId/:quizCode',
        pathRegEx: /\/quiz\/\/user\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQProfile,

    },
    {
        name: 'settingsPage',
        path: '/quiz/settings',
        needsLogin: true,
        component: CQSettings,

    },
    {
        name: 'publicPage',
        path: '/quiz/marketplace',
        needsLogin: undefined,
        component: CQMarketplace,

    },
    {
        name: 'publicMarketplacePage',
        path: '/quiz/lmarketplace',
        needsLogin: true,
        component: CQMarketplace,

    },
    {
        name: 'loginPage',
        path: '/quiz/login',
        needsLogin: false,
        component: CQLogin,

    },

    {
        name: 'registerPage',
        path: '/quiz/register',
        needsLogin: false,
        component: CQRegister,

    },

    {
        name: 'registerAndCreatePage',
        path: '/quiz/register/create',
        needsLogin: false,
        component: CQRegister,

    },

    {
        name: 'recoverPassword',
        path: '/quiz/recover',
        needsLogin: false,
        component: CQRecoverPassword,

    },

    {
        name: 'restorePassword',
        path: '/quiz/reset/:code',
        pathRegEx: /\/quiz\/reset\/([\w\-]+)/,
        needsLogin: false,
        component: CQRestorePassword,

    },

    {
        name: 'yourApps',
        path: '/quiz/apps',
        needsLogin: true,
        component: CQYourApps,

    },

    {
        name: 'yourAppsEdit',
        path: '/quiz/apps/:appId',
        pathRegEx: /\/quiz\/apps\/([\w\-]+)/,
        needsLogin: true,
        component: CQYourApps,

    },

    {
        name: 'quizzes',
        path: '/quiz/quizzes',
        needsLogin: true,
        component: CQOwnProfile,

    },

    {
        name: 'quizzesShare',
        path: '/quiz/quizzes/s/:quizCode',
        pathRegEx: /\/quiz\/quizzes\/s\/([\w\-]+)/,
        needsLogin: true,
        component: CQOwnProfile,

    },

    {
        name: 'redirect',
        path: '/quiz/playh/:redirectURL',
        pathRegEx: /\/quiz\/playh\/([\w\-]+)/,
        needsLogin: true,
        component: CQRedirect,

    },

    {
        name: 'create',
        path: '/quiz/create',
        needsLogin: true,
        component: CQEdit,

    },

    {
        name: 'editQuiz',
        path: '/quiz/edit/:quizId',
        pathRegEx: /\/quiz\/edit\/([\w\-]+)/,
        needsLogin: true,
        component: CQCreate,

    },

    {
        name: 'reviewQuiz',
        path: '/quiz/review/:quizId',
        pathRegEx: /\/quiz\/review\/([\w\-]+)/,
        needsLogin: true,
        component: CQReview,

    },


    {
        name: 'edit',
        path: '/quiz/create/:quizId',
        pathRegEx: /\/quiz\/create\/([\w\-]+)/,
        needsLogin: true,
        component: CQEdit,

    },

    {
        name: 'editQuestion',
        path: '/quiz/create/:quizId/:questionIndex',
        pathRegEx: /\/quiz\/create\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: true,
        component: CQEdit,

    },

    {
        name: 'assignments',
        path: '/quiz/assignments',
        needsLogin: true,
        component: CQAssignments,

    },

    {
        name: 'multi',
        path: '/quiz/multi/:quizId',
        pathRegEx: /\/quiz\/multi\/([\w\-]+)/,
        needsLogin: true,
        component: CQAssignQuiz,

    },


    {
        name: 'published',
        path: '/quiz/published/:quizId',
        pathRegEx: /\/quiz\/published\/([\w\-]+)/,
        needsLogin: true,
        component: CQPublished,

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

    },


    {
        name: 'publishedInfo',
        path: '/quiz/published/:quizId/:classCode/info',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/([\w\-]+)\/info/,
        needsLogin: true,
        component: CQPublishedInfo,

    },

    {
        name: 'app',
        path: '/quiz/app/:appId',
        pathRegEx: /\/quiz\/app\/([\w\-]+)/,
        needsLogin: undefined,
        component: CQApp,

    },

    {
        name: 'pageNotFound',
        path: '*',
        needsLogin: false,
        component: CQNotFound,
        
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
