var React           = require('react');
var router          = require('./router');
// var settings        = require('utils/settings');

var CQDashboard         = require('createQuizApp/flux/components/CQDashboard');
var CQNotFound          = require('createQuizApp/flux/components/pages/CQNotFound');
var CQLogin             = require('createQuizApp/flux/components/pages/CQLogin');
var CQRegister          = require('createQuizApp/flux/components/pages/CQRegister');
var CQRecoverPassword          = require('createQuizApp/flux/components/pages/CQRecoverPassword');
var CQQuizzes          = require('createQuizApp/flux/components/pages/CQQuizzes');
var CQCreate           = require('createQuizApp/flux/components/pages/CQCreate');
var CQEdit             = require('createQuizApp/flux/components/pages/CQEdit');
// var RegisterPage    = require('components/RegisterPage.jsx');
// var RecoverPasswordPage = require('components/RecoverPasswordPage.jsx');
// var ResetPasswordPage = require('components/ResetPasswordPage.jsx');
//
// var AssessmentsPage = require('components/AssessmentsPage.jsx');
// var QuizPage        = require('components/QuizPage.jsx');
// var SettingsPage    = require('components/SettingsPage.jsx');
//
// var PassportPage    = require('components/PassportPage.jsx');
// var NotAllowedPage  = require('components/NotAllowedPage.jsx');


var pages = {
    pathParams: {
        quizId: /([\w\-]+)/,
        questionIndex: /([\w\-]+)/
    },
    mainPage: {
        path: '/quiz/',
        needsLogin: false,
        renderer: function(){
            console.info('renderMain');
            React.render(
                React.createElement(CQDashboard, null),
                document.getElementById('reactApp')
            );
        }
    },
    loginPage: {
        path: '/quiz/login',
        needsLogin: false,
        renderer: function(props){
            React.render(
                React.createElement(CQLogin, null),
                document.getElementById('reactApp')
            );
        }
    },
    registerPage: {
        path: '/quiz/register',
        needsLogin: false,
        renderer: function(){
            React.render(
                React.createElement(CQRegister, null),
                document.getElementById('reactApp')
            );
        }
    },
    recoverPassword: {
        path: '/quiz/recover',
        needsLogin: false,
        renderer: function(){
            React.render(
                React.createElement(CQRecoverPassword, null),
                document.getElementById('reactApp')
            );
        }
    },
    quizzes: {
        path: '/quiz/quizzes',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQQuizzes, null),
                document.getElementById('reactApp')
            );
        }
    },
    create: {
        path: '/quiz/create',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQCreate, null),
                document.getElementById('reactApp')
            );
        }
    },

    edit: {
        path: '/quiz/create/:quizId',
        pathRegEx: /\/quiz\/create\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props){
            React.render(
                React.createElement(CQEdit, props),
                document.getElementById('reactApp')
            );
        }
    },

    editQuestion: {
        path: '/quiz/create/:quizId/:questionIndex',
        pathRegEx: /\/quiz\/create\/([\w\-]+)\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props){
            React.render(
                React.createElement(CQEdit, props),
                document.getElementById('reactApp')
            );
        }
    },
    // resetPassword: {
    //     path: '/resetpass',
    //     needsLogin: false,
    //     renderer: function(){
    //         React.render(
    //             React.createElement(ResetPasswordPage, null),
    //             document.getElementById('reactApp')
    //         );
    //     }
    // },
    // assessmentsPage: {
    //     path: settings.routeQuiz,
    //     needsLogin: true,
    //     renderer: function() {
    //         React.render(
    //             React.createElement(AssessmentsPage, null),
    //             document.getElementById('reactApp')
    //         );
    //     }
    // },
    // quizPageWithCategory: {
    //     path: settings.routeQuiz + '/:category',
    //     pathRegEx: /\/my\/assessment\/([\w\-]+)/,
    //     needsLogin: true,
    //     renderer: function(props) {
    //         if (props) {
    //             router.category(props.category);
    //         }
    //         React.render(
    //             React.createElement(QuizPage, null),
    //             document.getElementById('reactApp')
    //         );
    //     }
    // },
    // myResultsPage: {
    //     path: '/my/results',
    //     needsLogin: true,
    //     renderer: function() {
    //         React.render(
    //             React.createElement(QuizPage, null), // TODO: Change
    //             document.getElementById('reactApp')
    //         );
    //     }
    // },
    // mySettingsPage: {
    //     path: '/my/settings',
    //     needsLogin: true,
    //     renderer: function() {
    //         React.render(
    //             React.createElement(SettingsPage, null),
    //             document.getElementById('reactApp')
    //         );
    //     }
    // },
    // talentPassportPage: {
    //     path: '/talentpassport/:userid',
    //     pathRegEx: /\/talentpassport\/([\w\-]+)/,
    //     needsLogin: false,
    //     public: true,
    //     renderer: function(props) {
    //         React.render(
    //             React.createElement(PassportPage, { userid: props.userid }),
    //             document.getElementById('reactApp')
    //         );
    //     }
    // },
    pageNotFound: {
        path: '',
        needsLogin: false,
        renderer: function() {
            React.render(
                React.createElement(CQNotFound, null),
                document.getElementById('reactApp')
            );
        }
    },
    // pageNotAllowed: {
    //     path: '',
    //     needsLogin: false,
    //     renderer: function() {
    //         React.render(
    //             React.createElement(NotAllowedPage, null),
    //             document.getElementById('reactApp')
    //         );
    //     }
    // }
};

module.exports = pages;
