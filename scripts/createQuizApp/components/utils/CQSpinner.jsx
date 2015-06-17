var React = require('react');
require('./CQSpinnerStyles');
var CQSpinner = React.createClass({

    render: function() {
        return (
            <div className="cq-loader">Loading...</div>
        );
    }

});

module.exports = CQSpinner;
