/* @flow */
import React from 'react';
import { router } from './../../../config';

import { QuizActions } from './../../../actions';
import { CQPageTemplate } from './../../../components';
import { QuizStore } from './../../../stores';


var CQReview = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getDefaultProps: function() : Object {
        return {
        };
    },

    getInitialState: function() : Object {


        var initialState = {
            quiz: this._getQuiz(),
            isValid: false
        };

        return initialState;

    },

    _getQuiz: function(props? : Object) : Object {
        props = props || this.props;

        var quiz = props.quizId ? QuizStore.getQuiz(props.quizId) : undefined;


        if (quiz === undefined){
            if (this.props.quizId) {
                QuizActions.loadQuiz(this.props.quizId);
            }
            quiz = {
                meta: {
                    name: "",
                    subject: "",
                    category: "",
                    description: undefined,
                    imageUrl: undefined,
                    imageAttribution: undefined,
                    live: false,
                    featured: false,
                    featureDate: undefined,
                    numQuestions: undefined,
                    random: false,
                    review: 2,
                    comment: ""
                },
                payload: {}
            };

        }


        return quiz;
    },

    onChange: function(){

        var newState = {};

        var quiz = this._getQuiz();
        newState.quiz = quiz;

        this.setState(newState);
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    handleChange: function(property : string, event : Object) {
        var newQuizState = Object.assign({}, this.state.quiz);
        newQuizState.meta[property] = event.target.value;

        this.setState({quiz: newQuizState});
    },

    updateStars: function(num: number) {
        var newQuizState = Object.assign({}, this.state.quiz);
        newQuizState.meta.review = num;
        this.setState({
            quiz: newQuizState,
            isValid: true
        });
    },

    handleSaveReview: function(){
        this.setState({isSaving: true});
        QuizActions.saveReview(this.state.quiz)
            .then(function() {
                router.setRoute('/quiz/user');
            })
            .catch(function(){
                swal('Error saving your review', 'There has been an error, please try again later');
            });
    },

    render: function() {

            var star = (num) => {
                if (num > this.state.quiz.meta.review || this.state.quiz.meta.review === undefined) {
                    return (<span onClick={this.updateStars.bind(this, num)} className="fa fa-star-o cq-review__star"></span>);
                } else {
                    return (<span onClick={this.updateStars.bind(this, num)} className="fa fa-star cq-review__star--selected"></span>);
                }
            };

            return (
                <CQPageTemplate className="container cq-review">
                    <div className="">
                        <div className="row well">
                            <div className="col-sm-8 col-sm-offset-2 col-md-8 col-md-offset-2 col-lg-6 col-lg-offset-3">
                                <div className="well">
                                    <h2>
                                        Submit Review for {this.state.quiz.meta.name}
                                    </h2>
                                    <br/>
                                    <form role="form" className="form-horizontal">
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Rate this Quiz:</label>
                                            <div className="col-sm-9">
                                                {star(1)}
                                                {star(2)}
                                                {star(3)}
                                                {star(4)}
                                                {star(5)}
                                                <input id="review"
                                                    type="hidden"
                                                    value={this.state.quiz.meta.review}
                                                    onChange={this.handleChange.bind(this, 'review')}
                                                    autofocus="true"
                                                    tabIndex="1"
                                                    className="form-control"/><br/>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label className="col-sm-3 control-label">Comments:</label>
                                            <div className="col-sm-9">
                                                <textarea id="comment"
                                                    value={this.state.quiz.meta.comment}
                                                    onChange={this.handleChange.bind(this, 'comment')}
                                                    autofocus="true"
                                                    tabIndex="2"
                                                    className="form-control"/><br/>
                                            </div>
                                        </div>
                                    </form>
                                    <button type="button"
                                        onClick={this.handleSaveReview}
                                        disabled={this.state.isSaving || !this.state.isValid}
                                        tabIndex="3" className="btn btn-primary btn-block">Submit Review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </CQPageTemplate>
        );

    }
});

module.exports = CQReview;
