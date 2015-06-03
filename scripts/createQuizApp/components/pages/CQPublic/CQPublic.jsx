var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');

var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore  = require('createQuizApp/stores/QuizStore');

var UserStore  = require('createQuizApp/stores/UserStore');

var router = require('createQuizApp/config/router');

require('./CQPublicStyles');

var CQPublic = React.createClass({

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
        var newState = { quizzes };

        return newState;

    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        console.log('a', UserStore.getUser());
        window.location.href = `/app#/play/public/${quiz.uuid}/true`;
        // if (UserStore.getUser() === false) {
        // }
        // else {
        //     router.setRoute(this.props.href);
        //     $location.path("/playh/preview/" + quiz.uuid);
        // }
    },

    handleSet: function(quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    },

    render: function() {
        return (
            <CQPageTemplate className="container">
                <h2>
                    Choose a quiz for your class
                </h2>
                <p>
                    Check out our pre-made quizzes. We're adding new ones all the time! If you have any suggestions, tell us! Otherwise, you can <a href='/quiz/create'>Create your own in 60 seconds</a>.
                </p>

                {this.state.quizzes.map((category, categoryIndex) => {
                    return (<div className="row" key={categoryIndex}>
                        <div className="col-md-12">
                            <div className="quiz-topic-block">
                                <a href="" className="quiz-link">
                                    <h2 className="quiz-topic-title text-center">
                                        {category.category.name}
                                    </h2>
                                </a>
                                <div className="quiz-list collapse in">
                                    {category.quizzes.map((quiz, index)=>{
                                        return (
                                            <div className="row quiz-info-row" key={index}>
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

module.exports = CQPublic;
