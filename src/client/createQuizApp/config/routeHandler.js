/* @flow */
import { Router, Route } from 'react-router';
import history from './history';
import {MeStore} from './../stores';
import React from 'react';
import ReactDOM from 'react-dom';

var router              = require('./router');

var AnalyticsActions    = require('./../actions/AnalyticsActions');

import paths from './routesReact';

// history.listen(AnalyticsActions.trackPageView);
history.listen(function(){
    AnalyticsActions.trackPageView();
    window.scrollTo(0, 0);
    // TODO: Add local analaytics calls here
});

ReactDOM.render(<Router routes={paths} history={history} />, document.getElementById('reactApp'));


module.exports = router;
