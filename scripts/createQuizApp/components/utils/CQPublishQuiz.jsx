/* @flow */
import React from 'react';
import router from './../../config/router';
import UserStore from './../../stores/UserStore';

var CQPublishQuiz = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        disabled: React.PropTypes.boolean
    },

    handleIgnore: function(ev:Object) {
        ev.preventDefault();
        ev.stopPropagation();
    },

    handlePublish: function(ev:Object){
        if (this.props.quiz.payload.questions &&
            this.props.quiz.payload.questions.length >= 3 &&
            this.props.quiz.payload.questions[0].question.length > 0) {
            ev.preventDefault();
            ev.stopPropagation();
            // we check if the user has the details
            var quiz = this.props.quiz;
            var user = UserStore.getUser();
            if (user && user.name && user.name.length > 0) {
                console.log('we got user with name', user.name);
                if (quiz){
                    router.setRoute(`/quiz/published/${quiz.uuid}/publish`);
                }
            } else {

                swal({
                    title: 'You have an incomplete profile',
                    text: `To publish to the marketplace you must complete your profile.`,
                    type: 'info',
                    confirmButtonText: 'Enter details',
                    showCancelButton: false
                }, function(isConfirm){
                    if (isConfirm){
                        router.setRoute(`/quiz/settings?redirect=${window.encodeURIComponent(`/quiz/published/${quiz.uuid}/publish`)}`);
                    }
                });
            }
        }
        else {
            swal("Whoops!", "You need to have at least three questions before you can publish this quiz");
        }
    },

    render: function(): any {
        var publishButton = (() => {
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
        })();

        return (
            <span>
                {publishButton}
            </span>
        );
    }

});

module.exports = CQPublishQuiz;
