var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');

var QuizActions = require('createQuizApp/flux/actions/QuizActions');
var QuizStore  = require('createQuizApp/flux/stores/QuizStore');

var UserStore  = require('createQuizApp/flux/stores/UserStore');

var router = require('createQuizApp/flux/config/router');

require('./CQPublicStyles');

var CQNotFound = React.createClass({

    getInitialState: function() {
        return {
            quizzes: []
        };
    },

    componentDidMount: function() {

        QuizActions.loadPublicQuizzes();
        // QuizActions.loadQuizzes();

        QuizStore.addChangeListener(this.onChange);

    },

    componentWillUnmount: function() {

        QuizStore.removeChangeListener(this.onChange);
    },

    getState: function(){

        var quizzes = QuizStore.getPublicQuizzes();
        console.log('quizzes', quizzes);
        var newState = { quizzes };

        return newState;

    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(){
        // if (QuizData.getUser()) {
        //     window.location.href="/app#/play/public/"+quiz.uuid+"/true";
        // }
        // else {
        //     router.setRoute(this.props.href);
        //     $location.path("/playh/preview/" + quiz.uuid);
        // }
    },


    render: function() {
        return (
            <CQPageTemplate className="container">
                <h2>
                    Choose a quiz for your class
                </h2>
                <p>
                    Check out our pre-made quizzes. We're adding new ones all the time! If you have any suggestions, tell us! Otherwise, you can <a href='/quiz#/'>Create your own in 60 seconds</a>.
                </p>

                {this.state.quizzes.map(category =>{
                    return (<div className="row">
                        <div className="col-md-12">
                            <div className="quiz-topic-block">
                                <a href="" className="quiz-link">
                                    <h2 className="quiz-topic-title text-center">
                                        {category.category.name}
                                    </h2>
                                </a>
                                <div className="quiz-list collapse in">
                                    {category.quizzes.map(quiz=>{
                                        return (
                                            <div className="row quiz-info-row">
                                                <div className="col-xs-8">
                                                    <a href="" className="quiz-item">
                                                        <div className="quiz-title">{quiz.name}</div>
                                                    </a>
                                                </div>
                                                <div className="col-xs-2">

                                                    <div className="row quiz-info-row">

                                                        <button className="btn btn-info btn-block" onClick={this.handleSet.bind(this, quiz)}>
                                                            Set this quiz
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-xs-2">

                                                    <div className="row quiz-info-row">
                                                        <button onClick={this.handlePreview.bind(this, quiz)} className="btn btn-info btn-block">Preview</button>


                                                    </div>
                                                </div>

                                            </div>

                                        );
                                    })}

                                </div>
                            </div>
                        </div>
                    </div>);
                })}
            </CQPageTemplate>
        );
    }

});

module.exports = CQNotFound;
