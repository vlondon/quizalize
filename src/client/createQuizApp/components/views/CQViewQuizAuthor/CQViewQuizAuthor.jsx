var React = require('react');

var CQLink = require('createQuizApp/components/utils/CQLink');
var CQLinkToUser = require('createQuizApp/components/utils/CQLinkToUser');


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
                <CQLinkToUser uuid={this.props.author.uuid} slug={this.props.author.profileUrl} stopPropagation={true}>
                    by {name}
                </CQLinkToUser>
            </span>
        );
    }

});

module.exports = CQViewQuizAuthor;
