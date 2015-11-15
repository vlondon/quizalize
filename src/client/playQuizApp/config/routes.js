/* @flow */
var React               = require('react');

import PQSplash from './../components/pages/PQSplash';
import PQLogin from './../components/pages/PQLogin';
import PQQuiz from './../components/pages/PQQuiz';

export type Page = {
    name: string;
    path: string;
    pathRegEx?: Object;
    needsLogin: ?boolean;
    renderer: Function;
}

var pagesArray: Array<Page> = [
    {
        name: 'mainPage',
        path: '/play',
        needsLogin: undefined,
        renderer: function(){
            console.log('Quiz Page!');
            React.render(
                React.createElement(PQQuiz, null),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'studentLogin',
        path: '/play/class',
        needsLogin: undefined,
        renderer: function(){

            React.render(
                React.createElement(PQLogin, null),
                document.getElementById('reactApp')
            );
        }
    },
    {
        name: 'pageNotFound',
        path: '/play',
        needsLogin: undefined,
        renderer: function(){
            console.log('haaahah?');
            React.render(
                React.createElement(PQSplash, null),
                document.getElementById('reactApp')
            );
        }
    }
];

var pages = {
    pathParams: {
        quizId: /([\w\-]+)/,
        appId: /([\w\-]+)/,
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
