/* @flow */
import React from 'react';
import router from './../../config/router';
import UserStore from './../../stores/UserStore';
import QuizActions from './../../actions/QuizActions';
import priceFormat from './../../utils/priceFormat';

var CQPublishQuiz = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        disabled: React.PropTypes.boolean,
        prePublished: React.PropTypes.func
    },

    handleIgnore: function(ev:Object) {
        ev.preventDefault();
        ev.stopPropagation();
    },

    publishQuiz: function() {
        QuizActions.loadQuiz(this.props.quiz.uuid).then( (quiz) => {
            var error = false;
            if (quiz.payload.questions &&
                quiz.payload.questions.length >= 3) {
                quiz.payload.questions.forEach(function(q) {
                    if (q.question.length ==0 || q.answer.length ==0) {
                        error = true;
                    }
                });
                if (!error) {
                    // we check if the user has the details
                    var user = UserStore.getUser();
                    if (user && user.name && user.name.length > 0) {
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
            }
            else {
                error = true;
            }
            if (error) {
                swal({
                    title: 'Whoops',
                    text: `You need to have at least three questions before you can publish this quiz`,
                    type: 'info',
                    confirmButtonText: 'Edit Quiz',
                    showCancelButton: false
                }, function(isConfirm){
                    router.setRoute(`/quiz/create/${quiz.uuid}/`);
                });
            }
        });
    },

    handlePublish: function(ev:Object){
        ev.preventDefault();
        ev.stopPropagation();
        if (this.props.prePublished) {
            this.props.prePublished(this.publishQuiz);
        }
        else {
            this.publishQuiz();
        }
    },

    render: function(): any {
        var publishButton;

        if (!this.props.quiz.meta.originalQuizId) {
            if (this.props.quiz.meta.published === "pending") {
                publishButton = (
                    <button className="cq-quizzes__button--publish" disabled="disabled" onClick={this.handleIgnore}>
                        <span className="fa fa-shopping-cart"></span> Published Pending
                    </button>
                );
            }
            else if (this.props.quiz.meta.published === "published") {
                var price = this.props.quiz.meta.price ? 'Available for ' + priceFormat(this.props.quiz.meta.price, '$', 'us') : 'Public';
                publishButton = (
                    <button className="cq-quizzes__button--publish" disabled="disabled" onClick={this.handleIgnore}>
                        {price}
                    </button>
                );
            }
            else {
                publishButton = (
                    <button className="cq-quizzes__button--publish" onClick={this.handlePublish}>
                        <span className="fa fa-lock"></span> Make Public
                    </button>
                );
            }
        }


        return (
            <span>
                {publishButton}
            </span>
        );
    }

});

module.exports = CQPublishQuiz;
