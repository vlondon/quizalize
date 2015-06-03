var React           = require('react');
var router          = require('./router');
// var settings        = require('utils/settings');

var CQDashboard         = require('createQuizApp/components/pages/CQDashboard');
var CQPublic            = require('createQuizApp/components/pages/CQPublic');
var CQNotFound          = require('createQuizApp/components/pages/CQNotFound');
var CQLogin             = require('createQuizApp/components/pages/CQLogin');
var CQRegister          = require('createQuizApp/components/pages/CQRegister');
var CQRecoverPassword   = require('createQuizApp/components/pages/CQRecoverPassword');
var CQRedirect          = require('createQuizApp/components/pages/CQRedirect');
var CQQuizzes           = require('createQuizApp/components/pages/CQQuizzes');
var CQCreate            = require('createQuizApp/components/pages/CQCreate');
var CQEdit              = require('createQuizApp/components/pages/CQEdit');
var CQAssignments       = require('createQuizApp/components/pages/CQAssignments');
var CQPublished         = require('createQuizApp/components/pages/CQPublished');
var CQPublishedInfo     = require('createQuizApp/components/pages/CQPublishedInfo');
var CQHelp              = require('createQuizApp/components/pages/CQHelp');



var pages = {
    pathParams: {
        quizId: /([\w\-]+)/,
        questionIndex: /([\w\-]+)/,
        classCode: /([\w\-]+)/,
        redirectURL: /([\w\-]+)/
    },
    mainPage: {
        path: '/quiz',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQDashboard, null),
                document.getElementById('reactApp')
            );
        }
    },
    mainPageWithSlash: {
        path: '/quiz/',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQDashboard, null),
                document.getElementById('reactApp')
            );
        }
    },
    helpPage: {
        path: '/quiz/help',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQHelp, null),
                document.getElementById('reactApp')
            );
        }
    },
    publicPage: {
        path: '/quiz/public',
        needsLogin: undefined,
        renderer: function(){
            React.render(
                React.createElement(CQPublic, null),
                document.getElementById('reactApp')
            );
        }
    },
    loginPage: {
        path: '/quiz/login',
        needsLogin: false,
        renderer: function(){
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

    registerAndCreatePage: {
        path: '/quiz/register/create',
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
    redirect: {
        path: '/quiz/playh/:redirectURL',
        pathRegEx: /\/quiz\/playh\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props){
            React.render(
                React.createElement(CQRedirect, props),
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

    editQuiz: {
        path: '/quiz/edit/:quizId',
        pathRegEx: /\/quiz\/edit\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props){
            React.render(
                React.createElement(CQCreate, props),
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

    assignments: {
        path: '/quiz/assignments',
        needsLogin: true,
        renderer: function(){
            React.render(
                React.createElement(CQAssignments, null),
                document.getElementById('reactApp')
            );
        }
    },

    published: {
        path: '/quiz/published/:quizId',
        pathRegEx: /\/quiz\/published\/([\w\-]+)/,
        needsLogin: true,
        renderer: function(props){
            React.render(
                React.createElement(CQPublished, props),
                document.getElementById('reactApp')
            );
        }
    },

    publishedInfo: {
        path: '/quiz/published/:quizId/:classCode/info',
        pathRegEx: /\/quiz\/published\/([\w\-]+)\/([\w\-]+)\/info/,
        needsLogin: true,
        renderer: function(props){
            React.render(
                React.createElement(CQPublishedInfo, props),
                document.getElementById('reactApp')
            );
        }
    },

    pageNotFound: {
        path: '',
        needsLogin: false,
        renderer: function() {
            React.render(
                React.createElement(CQNotFound, null),
                document.getElementById('reactApp')
            );
        }
    }
};

module.exports = pages;