import React from 'react';
import ReactDOM from 'react-dom';

import ADPendingTable from './components/ADPendingTable';


console.log('admin.js');

window.pendingPage = function(data){

    ReactDOM.render(
        <ADPendingTable
            categories={data.categories}
            subjects={data.subjects}
            quizzes={data.quizzes}
        />,
        document.getElementById('react')
    );
};
