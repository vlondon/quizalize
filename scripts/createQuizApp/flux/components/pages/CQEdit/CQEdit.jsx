var React = require('react');
var assign = require('object-assign');

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


    _getQuiz: function(props){
        props = props || this.props;
        var quiz = QuizStore.getQuiz(props.quizId) || {
            name: '',
            questions: []
        };

        return quiz;
    },


    _getCurrentQuestion: function(props){

        props = props || this.props;

        var currentQuiz = QuizStore.getQuiz(this.props.quizId);

        if (currentQuiz) {
            console.log('currentQuiz', currentQuiz);
            return currentQuiz.questions[props.questionIndex];
        }

        return undefined;
    },

    getInitialState: function() {

        return {
            quiz: this._getQuiz(),
            mode: 'Create'
        };
    },

    componentDidMount: function() {
        if (this.state.quiz.uuid === undefined){
            QuizActions.loadQuiz(this.props.quizId);
        }
        // QuizActions.loadQuizzes();
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        this.onChange(nextProps);
    },

    onChange: function(props){
        this.setState({
            quiz: this._getQuiz(props),
            activeQuestion: this._getCurrentQuestion(props)
        });
    },

    handleQuestion: function(question){
        console.log('new question', question);
        var updatedQuiz = assign({}, this.state.quiz);

        
        var index = this.props.questionIndex || this.props.quiz.questions.length;
        updatedQuiz.questions[index] = question;
        this.setState({quiz: updatedQuiz});
    },

    handleSave: function(question){
        console.log('should save', question);
        QuizActions.newQuiz(this.state.quiz);
    },

    render: function() {

        return (
            <CQPageTemplate className="container">
                <div className="container">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="well">
                                <h3>{this.state.mode}
                                    <span style={{color: 'red'}}>Question {this.state.currentQuestion} </span>for {this.state.quiz.name}
                                    <button ng-click="create.editQuiz();" style={{margin: '8px'}} className="btn btn-sm btn-info"><span className="glyphicon glyphicon-cog"> </span></button>
                                </h3>
                                <p class="small">
                                    Speed Tip: We found clicking is a pain - just hit enter to step through quickly
                                </p>

                                <CQEditNormal
                                    onChange={this.handleQuestion}
                                    question={this.state.quiz.questions[this.props.questionIndex]}
                                    onSave={this.handleSave}/>

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
