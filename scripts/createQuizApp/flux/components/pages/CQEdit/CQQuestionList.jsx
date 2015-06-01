var React = require('react');

var CQLink = require('createQuizApp/flux/components/utils/CQLink');
var CQEditNormal = require('./CQEditNormal');

var CQQuestionList = React.createClass({
    propTypes: {
        quiz: React.PropTypes.object.isRequired,
        handleSave: React.PropTypes.func.isRequired
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

    render: function() {
        console.log('rerendering!');
        var questions;
        var isNewQuestion;
        var addButton;
        var questionEditor = (<CQEditNormal
            question={this.props.quiz.questions[this.props.questionIndex]}
            onChange={this.handleQuestion}
            onSave={this.handleSave}/>);
        var newQuestionEditor;

        if (this.props.questionIndex === this.props.quiz.questions.length){
            newQuestionEditor = questionEditor;
            isNewQuestion = true;
            addButton = (<div/>);
        } else {
            addButton = (<CQLink href={`/quiz/create/${this.props.quiz.uuid}/`}>

                <button type='button' style={{margin: '4px'}} className="btn btn-info">
                    <span className="glyphicon glyphicon-plus"></span>
                </button>
            </CQLink>);
            newQuestionEditor = (<div/>);
            isNewQuestion = false;
        }

        if (this.props.quiz.questions.length > 0) {

            questions = this.props.quiz.questions.map((item, index) => {
                var editor;
                var className = 'row';
                console.log('should add the editor', index, this.props.questionIndex);
                if (index === this.props.questionIndex) {
                    editor = questionEditor;
                    className = 'row selected';
                }
                return (
                    <div className={className} key={index}>
                        <div className="col-sm-6">
                            <h4>
                                {index + 1}. {item.question}
                            </h4>
                        </div>
                        <div className="col-sm-4">
                            <h4 className="text-info">
                                {item.answer}
                            </h4>
                        </div>
                        <div className="col-sm-2 icons">
                            <CQLink href={`/quiz/create/${this.props.quiz.uuid}/${index}`}>

                                <button type='button' style={{margin: '4px'}} className="btn btn-info">
                                    <span className="glyphicon glyphicon-pencil"></span>
                                </button>
                            </CQLink>
                            <button type='button' className="btn btn-danger">
                                <span className="glyphicon glyphicon-remove"></span>
                            </button>

                        </div>
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
                            <div className="col-sm-10">
                                <h4>
                                    {this.props.quiz.questions.length + 1}. Add a new question
                                </h4>
                            </div>
                            <div className="col-sm-2 icons">
                                {addButton}


                            </div>

                            {newQuestionEditor}
                        </div>

                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CQQuestionList;
