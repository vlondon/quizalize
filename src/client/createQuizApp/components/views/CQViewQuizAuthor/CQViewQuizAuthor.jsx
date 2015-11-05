var React = require('react');

var CQLinkToUser = require('createQuizApp/components/utils/CQLinkToUser');

var CQViewQuizAuthor = React.createClass({

    propTypes: {
        authorId: React.PropTypes.string.isRequired,
        author: React.PropTypes.string.isRequired
    },

    getDefaultProps: function() {
        return {
            author: ''
        };
    },

    render: function() {
        var name = (this.props.author !== null && this.props.author) ? this.props.author : 'Quizalize user';

        return (
            <span className="cq-viewquizlist__quizauthor">
                <CQLinkToUser uuid={this.props.authorId} stopPropagation={true}>
                    by {name}
                </CQLinkToUser>
            </span>
        );
    }

});

module.exports = CQViewQuizAuthor;
