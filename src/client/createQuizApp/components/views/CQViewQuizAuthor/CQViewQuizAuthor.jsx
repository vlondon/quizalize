var React = require('react');

var CQLink = require('createQuizApp/components/utils/CQLink');


var CQViewQuizAuthor = React.createClass({

    propTypes: {
        author: React.PropTypes.object.isRequired
    },

    getDefaultProps: function() {
        return {
            author: {
                name: ''
            }
        };
    },

    render: function() {
        var name = (this.props.author !== null && this.props.author.name) ? this.props.author.name : 'Quizalize user';

        return (
            <span className="cq-viewquizlist__quizauthor">
                <CQLink href={`/quiz/user/${this.props.author.uuid}`} stopPropagation={true}>
                    by {name}
                </CQLink>
            </span>
        );
    }

});

module.exports = CQViewQuizAuthor;
