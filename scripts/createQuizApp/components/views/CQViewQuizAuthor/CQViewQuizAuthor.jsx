var React = require('react');

var CQViewQuizAuthor = React.createClass({

    propTypes: {
        author: React.PropTypes.object.isRequired
    },

    render: function() {
        return (
            <span className="cq-viewquizlist__quizauthor">
                by <b>{this.props.author.name}</b>
            </span>
        );
    }

});

module.exports = CQViewQuizAuthor;
