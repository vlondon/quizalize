/* @flow */

// var settings        = require('utils/settings');
import {
    CQWelcome,
    CQMarketplace,
    CQProfile,
    CQProfileSlug,
    CQOwnProfile,
    CQNotFound,
    CQLogin,
    CQRegister,
    CQRecoverPassword,
    CQRestorePassword,
    CQRedirect,
    CQReview,
    CQEdit,
    CQAssignments,
    CQPublished,
    CQPublishedPublished,
    CQPublishedAssign,
    CQPublishedShare,
    CQPublishedInfo,
    CQSettings,
    CQApp,
    CQYourApps,
    CQPremium,
    CQAssignQuiz,
    CQTransactions,
    CQDiscovery,
    CQDiscoveryPerformUpgrade,
    CQDiscoveryThankYou,
} from './../components';

export type Page = {
    name: string;
    path: string;
    needsLogin: ?boolean;
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
        name: 'mainPage',
        path: '/quiz/transaction',
        needsLogin: undefined,
        component: CQTransactions,

    },
    {
        name: 'discoveryPage',
        path: '/discovery-education-promotion',
        needsLogin: undefined,
        component: CQDiscovery,

    },
    {
        name: 'discoveryPage',
        path: '/discovery-education-free-premium-subscription',
        needsLogin: undefined,
        component: CQDiscoveryThankYou,

    },
    {
        name: 'discoveryPage',
        path: '/discovery-education-free-premium-subscription/perform-upgrade',
        needsLogin: true,
        component: CQDiscoveryPerformUpgrade,

    },
    {
        name: 'CQWelcome',
        path: '/quiz/welcome',
        needsLogin: true,
        component: CQWelcome
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
        needsLogin: undefined,
        component: CQProfileSlug,

    },
    {
        name: 'profilePage',
        path: '/quiz/user/:profileId',
        needsLogin: undefined,
        component: CQProfile,

    },
    {
        name: 'sharedQuizPage',
        path: '/quiz/user/:profileId/:quizCode',
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
        needsLogin: false,
        component: CQRestorePassword,

    },
    {
        name: 'yourApps',
        path: '/quiz/premium',
        needsLogin: undefined,
        component: CQPremium,

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
        needsLogin: true,
        component: CQOwnProfile,

    },

    {
        name: 'redirect',
        path: '/quiz/playh/:redirectURL',
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
        name: 'reviewQuiz',
        path: '/quiz/review/:quizId',
        needsLogin: true,
        component: CQReview,

    },


    {
        name: 'edit',
        path: '/quiz/create/:quizId',
        needsLogin: true,
        component: CQEdit,

    },

    {
        name: 'editQuestion',
        path: '/quiz/create/:quizId/:questionIndex',
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
        needsLogin: true,
        component: CQAssignQuiz,

    },


    {
        name: 'published',
        path: '/quiz/published/:quizId',
        needsLogin: true,
        component: CQPublished,

    },

    {
        name: 'publishedAssign',
        path: '/quiz/published/:quizId/assign',
        needsLogin: true,
        component: CQPublishedAssign
    },

    {
        name: 'publishedShare',
        path: '/quiz/published/:quizId/share',
        needsLogin: true,
        component: CQPublishedShare
    },

    {
        name: 'publishedPricing',
        path: '/quiz/published/:quizId/publish',
        needsLogin: true,
        component: CQPublishedPublished,

    },


    {
        name: 'publishedInfo',
        path: '/quiz/published/:quizId/:classCode/info',
        needsLogin: true,
        component: CQPublishedInfo,

    },

    {
        name: 'app',
        path: '/quiz/app/:appId',
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




module.exports = { pagesArray };
