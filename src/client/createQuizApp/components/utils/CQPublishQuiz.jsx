/* @flow */
import React from 'react';
import router from './../../config/router';
import MeStore from './../../stores/MeStore';
import {
    QuizActions
} from './../../actions';
import priceFormat from './../../utils/priceFormat';

var CQPublishQuiz = React.createClass({

    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        className: React.PropTypes.string,
        disabled: React.PropTypes.bool,
        prePublished: React.PropTypes.func
    },

    handleIgnore: function(ev:Object) {
        ev.preventDefault();
        ev.stopPropagation();
    },

    publishQuiz: function() {

        let {quiz} = this.props;
        let user = MeStore.getState();

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
