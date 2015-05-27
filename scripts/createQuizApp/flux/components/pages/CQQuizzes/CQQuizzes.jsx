var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');

require('./CQQuizzesStyles');

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
                    QUIZZES!!.
                </h2>
            </CQPageTemplate>
        );
    }

});

module.exports = CQNotFound;
