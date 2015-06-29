var React = require('react');

var CQPublishQuiz = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        className: React.PropTypes.string
    },

    handleIgnore: function(ev) {
        ev.preventDefault();
        ev.stopPropogation();
    },

    render: function() {
        var publishButton = () => {
            if (this.props.quiz.meta.publishing === "pending") {
                return (<button className="cq-quizzes__button--publish" disabled="disabled" onClick={this.handleIgnore}>
                    <span className="fa fa-shopping-cart"></span> Published Pending
                </button>);
            }
            else if (this.props.quiz.meta.publishing === "published") {
                return (<button className="cq-quizzes__button--publish" disabled="disabled" onClick={this.handleIgnore}>
                    <span className="fa fa-shopping-cart"></span> Published to Marketplace
                </button>);
            }
            else {
                return (<button className="cq-quizzes__button--publish" onClick={this.handlePublish}>
                    <span className="fa fa-shopping-cart"></span> Publish to Marketplace
                </button>);
            }
        };

        return (
            <span>
                {publishButton()}
            </span>
        );
    }

});

module.exports = CQPublishQuiz;
