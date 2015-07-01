/* @flow */
var FastClick = require('fastclick');
FastClick.attach(document.body);

var test = function (x){
    return x * 2;
};
test('a');

require('./config/routeHandler');
