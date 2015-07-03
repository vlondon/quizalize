var React = require('react');

var CQLink = require('createQuizApp/components/utils/CQLink');


var CQViewQuizAuthor = React.createClass({

    propTypes: {
        author: React.PropTypes.object.isRequired
    },

    render: function() {
        console.log('this.props.author.name', this.props.author.name.length);
        var name = this.props.author.name.length !== 0 ? this.props.author.name : 'Quizalize user';
        return (
            <span className="cq-viewquizlist__quizauthor">
                <CQLink href={`/quiz/user/${this.props.author.uuid}`} stopPropagation={true}>

                    by <b>{name}</b>
                </CQLink>
            </span>
        );
    }

});

module.exports = CQViewQuizAuthor;
