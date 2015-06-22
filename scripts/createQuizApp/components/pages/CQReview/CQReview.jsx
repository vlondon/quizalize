var React = require('react');
var assign = require('object-assign');
var router = require('createQuizApp/config/router');

var QuizActions = require('createQuizApp/actions/QuizActions');
var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var QuizStore = require('createQuizApp/stores/QuizStore');


var CQReview = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
        };
    },

    getInitialState: function() {


        var initialState = {
            quiz: this._getQuiz()
        };

        console.log('do we have props', this.props);

        return initialState;

    },

    _getQuiz: function(props){
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

    handleChange: function(property, event) {
        console.log('handleChange');
        var newQuizState = assign({}, this.state.quiz);
        newQuizState.meta[property] = event.target.value;

        this.setState({quiz: newQuizState});
    },

    updateStars: function(num) {
        console.log('updateStars',num);
        var newQuizState = assign({}, this.state.quiz);
        newQuizState.meta['review'] = num;
        //this.setState({quiz: newQuizState});
    },

    handleSaveReview: function(){
        this.setState({isSaving: true});
        QuizActions.saveReview(this.state.quiz)
            .then(function(quiz) {
                console.log('we\'re saving review new quiz', quiz);
                router.setRoute('/quiz/quizzes');
            })
            .catch(function(){
                swal('Error saving your review', 'There has been an error, please try again later');
            });
    },

    render: function() {
            var star = (num) => {
                console.log("Num",num,this.state.quiz.meta.reviews)
                if (num<this.state.quiz.meta.review || !this.state.quiz.meta.review) {
                    return (<span onClick={this.updateStars(num)} className="fa fa-star-o cq-review__star"></span>);
                }
                else {
                    return (<span onClick={this.updateStars(num)} className="fa fa-star cq-review__star"></span>);
                }
            }

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
                                        disabled={this.state.isSaving}
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
