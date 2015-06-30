var React = require('react');
var router = require('createQuizApp/config/router');

var CQPublishQuiz = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        className: React.PropTypes.string
    },

    handleIgnore: function(ev) {
        ev.preventDefault();
        ev.stopPropogation();
    },

    handlePublish: function(){
        var quiz = this.props.quiz;
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}/publish`);
        }
    },

    render: function() {
        var publishButton = () => {
            if (!this.props.quiz.meta.originalQuizId) {
                if (this.props.quiz.meta.published === "pending") {
                    return (<button className="cq-quizzes__button--publish" disabled="disabled" onClick={this.handleIgnore}>
                        <span className="fa fa-shopping-cart"></span> Published Pending
                    </button>);
                }
                else if (this.props.quiz.meta.published === "published") {
                    return (<button className="cq-quizzes__button--publish" disabled="disabled" onClick={this.handleIgnore}>
                        <span className="fa fa-shopping-cart"></span> Published to Marketplace
                    </button>);
                }
                else {
                    return (<button className="cq-quizzes__button--publish" onClick={this.handlePublish}>
                        <span className="fa fa-shopping-cart"></span> Publish to Marketplace
                    </button>);
                }
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
