var React = require('react');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');

var CQSettings = React.createClass({

    render: function() {
        return (
            <CQPageTemplate className="container">
                <h3>Settings</h3>
            </CQPageTemplate>
        );
    }

});

module.exports = CQSettings;
