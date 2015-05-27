var React = require('react');
// var CQHeader = require('createQuizApp/flux/components/CQHeader');
// var CQDashboard = require('createQuizApp/flux/components/CQDashboard');

var CQApp = React.createClass({

    render: function() {
        return (
            <div>
                <CQHeader/>
                <CQDashboard/>
            </div>
        );
    }

});

console.log('dom', document.getElementById('reactApp'));
// React.render(
//     React.createElement(CQApp, {}),
//     document.getElementById('reactApp')
// );


require('./config/routeHandler');
