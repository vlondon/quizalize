var React = require('react');

var CQLink = require('createQuizApp/components/utils/CQLink');

var CQViewQuizAuthor = React.createClass({

    propTypes: {
        author: React.PropTypes.object.isRequired
    },

    render: function() {
        console.log('author', this.props.author);
        return (
            <span className="cq-viewquizlist__quizauthor">
                <CQLink href={`/quiz/user/${this.props.author.uuid}`}>

                    by <b>{this.props.author.name}</b>
                </CQLink>
            </span>
        );
    }

});

module.exports = CQViewQuizAuthor;
