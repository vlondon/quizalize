/* @flow */
var React               = require('react');

var PQSplash            = require('./../components/pages/PQSplash');

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
            console.log('haaahah?');
            React.render(
                React.createElement(PQSplash, null),
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
