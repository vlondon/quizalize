var React = require('react');
var router = require('createQuizApp/config/router');
var CQEditNormal = require('./CQEditNormal');

var CQLatexString = require('react-latex');

var CQQuestionList = React.createClass({
    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        handleSave: React.PropTypes.func.isRequired,
        questionIndex: React.PropTypes.number,
        handleQuestion: React.PropTypes.func,
        handleRemoveQuestion: React.PropTypes.func,
        setSaveMode: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            questions: []
        };
    },

    getInitialState: function() {
        return {
            canAddQuestion: true
        };
    },
    setSaveMode: function(canBeSaved){
        this.props.setSaveMode(canBeSaved);
        this.setState({canAddQuestion: canBeSaved});
    },

    handleSave: function(){
        this.props.handleSave();
        this.setState({canAddQuestion: false});
    },

    handleQuestion: function(question){
        this.props.handleQuestion(question);
    },

    handleRemove: function(question, event){
        this.props.handleRemoveQuestion(question, event);
    },

    handleEdit: function(index){
        if (this.props.questionIndex !== index){
            router.setRoute(`/quiz/create/${this.props.quiz.uuid}/${index}`);
        }
    },

    render: function() {

        var questions;
        var newQuestionEditor;

        var questionEditor = (
            <CQEditNormal
                setSaveMode={this.setSaveMode}
                quiz={this.props.quiz}
                questionIndex={this.props.questionIndex}
                onChange={this.handleQuestion}
                onSave={this.handleSave}/>
            );


        if (this.props.questionIndex === this.props.quiz.payload.questions.length){

            newQuestionEditor = (
                <div className='cq-edit__quiz cq-edit__quiz--selected'>
                    <div className="col-sm-6">
                        <i>{this.props.questionIndex + 1}. Creating new question</i>
                    </div>
                    <div className="col-sm-4">
                        <h4 className="text-info">

                        </h4>
                    </div>

                    <div className="clearfix"></div>
                    {questionEditor}
                </div>
            );

        } else {
            newQuestionEditor = (<div/>);
        }

        if (this.props.quiz.payload.questions.length > 0) {

            questions = this.props.quiz.payload.questions.map((item, index) => {
                var editor = index === this.props.questionIndex ? questionEditor : undefined;
                var className = index === this.props.questionIndex ? 'cq-edit__quiz cq-edit__quiz--selected' : 'cq-edit__quiz cq-edit__quiz--unselected';



                return (
                    <div className={className} key={index} onClick={this.handleEdit.bind(this, index)}>
                        <div className="col-sm-6 cq-edit__listquestion">
                            <span className="label label-primary">Q</span>&nbsp;
                            <CQLatexString>{item.question}</CQLatexString>
                        </div>
                        <div className="col-sm-4 cq-edit__listanswer">
                            <span className="label label-warning">A</span>&nbsp;
                            <CQLatexString>{item.answer}</CQLatexString>
                        </div>
                        <div className="col-sm-2 icons">

                            <button type='button' className="btn btn-danger btn-xs" onClick={this.handleRemove.bind(this, item)}>
                                <span className="glyphicon glyphicon-remove"></span>
                            </button>

                        </div>
                        <div className="clearfix"></div>
                        {editor}
                    </div>
                );
            });
        } else {
            questions = (<div/>);
        }


        return (
            <div className="cq-questionlist">
                {questions}
                {newQuestionEditor}
                <div className='new-question-cta'>

                    <button type='button'
                        className="btn btn-default cq-questionlist__button"
                        disabled={!this.state.canAddQuestion}
                        onClick={this.handleSave}>
                        <span className="glyphicon glyphicon-plus"></span> Add a new question
                    </button>

                </div>
            </div>
        );
    }

});

module.exports = CQQuestionList;
