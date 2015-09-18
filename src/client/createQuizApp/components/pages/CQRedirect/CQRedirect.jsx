var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');


var CQNotFound = React.createClass({

    getInitialState: function() {
        return {};
    },


    render: function() {
        return (
            <CQPageTemplate className="container">
                <h2>
                    Redirecting… {this.props.redirectUrl}
                </h2>
            </CQPageTemplate>
        );
    }

});

module.exports = CQNotFound;
