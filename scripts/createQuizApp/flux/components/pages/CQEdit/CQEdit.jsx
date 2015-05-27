var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');
var CQEditNormal = require('./CQEditNormal');
var CQQuestionList = require('./CQQuestionList');

var QuizStore = require('createQuizApp/flux/stores/QuizStore');
var QuizActions = require('createQuizApp/flux/actions/QuizActions');

require('./CQEditStyles');



var CQEdit = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },

    _getQuiz: function(){
        var quiz = QuizStore.getQuiz(this.props.quizId) || {
            name: '',
            questions: []
        };

        return quiz;
    },

    _getCurrentQuestion: function(){
        
    },

    getInitialState: function() {

        return {
            quiz: this._getQuiz(),
            mode: 'Create',
            currentQuestion: 1
        };
    },

    componentDidMount: function() {
        if (this.state.quiz.uuid === undefined){
            QuizActions.loadQuiz(this.props.quizId);
        }
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState({quiz: this._getQuiz()});
    },
    render: function() {

        return (
            <CQPageTemplate className="container">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="well">
                                <h3>{this.state.mode}  <span style={{color: 'red'}}>Question {this.state.currentQuestion} </span>for {this.state.quiz.name}
                                    <button ng-click="create.editQuiz();" style={{margin: '8px'}} className="btn btn-sm btn-info"><span className="glyphicon glyphicon-cog"> </span></button>
                                </h3>
                                <p class="small">
                                    Speed Tip: We found clicking is a pain - just hit enter to step through quickly
                                </p>

                                <CQEditNormal/>

                            </div>

                            <CQQuestionList questions={this.state.quiz.questions} quiz={this.state.quiz}/>
                        </div>
                    </div>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQEdit;
