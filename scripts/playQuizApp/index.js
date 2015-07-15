var FastClick = require('fastclick');
FastClick.attach(document.body);

if(typeof window.zzish === 'undefined') {
    console.error('Require zzish.js to use zzish');
} else {
    console.log('running zzish init');
    zzish.init(window.initToken);
}


require('./config/routeHandler');
