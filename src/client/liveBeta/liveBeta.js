import ReactDOM from 'react-dom';
import React from 'react';
import LiveBeta from './components/LiveBeta';

var liveBetaState = {
    classCode: 'buu367',
    activityName: 'KS3 Maths - Geometry and measures',
    students: [
        // {
        //     uuid: 'a',
        //     name: 'Charles',
        //     score: 0,
        //     progress: 0,
        //     start: 1443784156885
        // },
        // {
        //     uuid: 'b',
        //     name: 'Francesco',
        //     score: 0,
        //     progress: 0,
        //     start: 1443782478290
        // },
        // {
        //     uuid: 'c',
        //     name: 'Samir',
        //     score: 0,
        //     progress: 0,
        //     start: 1443782515712
        // }
    ]
};

var updateState = function(newState){
    console.log('we got new state?', newState);
    if (newState) {
        liveBetaState = Object.assign({}, newState);
    }

    liveBetaState.students = liveBetaState.students.sort((a, b) => { return a.start > b.start ? 1 : -1; });

    render();
};

console.log("document.getElementById('dashboardBeta')", document.getElementById('dashboardBeta'));
var render = function(){
    ReactDOM.render(
        <LiveBeta dashState={liveBetaState} onStateUpdate={updateState}/>,
        document.getElementById('dashboardBeta')
    );
};

updateState();
// var React = require('react');
