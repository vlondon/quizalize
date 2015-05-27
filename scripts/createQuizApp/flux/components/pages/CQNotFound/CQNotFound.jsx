var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');

require('./CQNotFoundStyles');

var CQNotFound = React.createClass({

    getInitialState: function() {
        return {
            user: ''
        };
    },


    render: function() {
        return (
            <CQPageTemplate className="container">
                <h2>
                    Page not found.
                </h2>
            </CQPageTemplate>
        );
    }

});

module.exports = CQNotFound;
