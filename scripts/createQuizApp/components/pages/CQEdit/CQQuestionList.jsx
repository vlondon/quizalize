var React = require('react');

var CQLink = require('createQuizApp/components/utils/CQLink');
var CQEditNormal = require('./CQEditNormal');

var CQLatexString = require('./CQLatexString');

var CQQuestionList = React.createClass({
    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        handleSave: React.PropTypes.func.isRequired,
        questionIndex: React.PropTypes.number,
        handleQuestion: React.PropTypes.func,
        handleRemoveQuestion: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            questions: []
        };
    },

    handleSave: function(data){
        this.props.handleSave(data);
    },

    handleQuestion: function(question){
        if (this.props.questionIndex !== this.props.quiz.questions.length){
            this.props.handleQuestion(question);
        }
    },

    handleRemove: function(question){
        this.props.handleRemoveQuestion(question);
    },

    render: function() {

        var questions;
        var isNewQuestion;
        var addButton;

        var questionEditor = (
            <CQEditNormal
                quiz={this.props.quiz}
                questionIndex={this.props.questionIndex}
                onChange={this.handleQuestion}
                onSave={this.handleSave}/>
            );

        var newQuestionEditor;

        if (this.props.questionIndex === this.props.quiz.questions.length){

            newQuestionEditor = (
                <span className='cq-edit__quiz new-question'>
                    <div className="col-sm-6">
                        <h4>
                            <i>{this.props.questionIndex + 1}. Creating new question</i>
                        </h4>
                    </div>
                    <div className="col-sm-4">
                        <h4 className="text-info">

                        </h4>
                    </div>

                    <div className="clearfix"></div>
                    {questionEditor}
                </span>
            );
            isNewQuestion = true;
        } else {

            addButton = (
                <div className='new-question-cta'>

                    <CQLink href={`/quiz/create/${this.props.quiz.uuid}/${this.props.quiz.questions.length}`}>
                        <button type='button' style={{margin: '4px'}} className="btn btn-default">
                            <span className="glyphicon glyphicon-plus"></span>
                            &nbsp;Add a new question
                        </button>
                    </CQLink>

                </div>
            );
            newQuestionEditor = (<div/>);
            isNewQuestion = false;
        }

        if (this.props.quiz.questions.length > 0) {

            questions = this.props.quiz.questions.map((item, index) => {
                var editor;
                var className = 'cq-edit__quiz row';

                if (index === this.props.questionIndex) {
                    editor = questionEditor;
                    className = 'cq-edit__quiz row selected';
                }
                return (
                    <div className={className} key={index}>
                        <div className="col-sm-6">
                            <h4>
                                {index + 1}. <CQLatexString>{item.question}</CQLatexString>
                            </h4>
                        </div>
                        <div className="col-sm-4">
                            <h4 className="text-info">
                                <CQLatexString>{item.answer}</CQLatexString>
                            </h4>
                        </div>
                        <div className="col-sm-2 icons">
                            <CQLink href={`/quiz/create/${this.props.quiz.uuid}/${index}`}>

                                <button type='button' style={{margin: '4px'}} className="btn btn-info">
                                    <span className="glyphicon glyphicon-pencil"></span>
                                </button>
                            </CQLink>
                            <button type='button' className="btn btn-danger" onClick={this.handleRemove.bind(this, item)}>
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
            <div className="row ql-question-list">
                <div className="col-xs-12 ">
                    <div className="well">
                        {questions}

                        <div className={isNewQuestion ? 'row selected' : 'row'}>

                            {addButton}
                            {newQuestionEditor}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CQQuestionList;
