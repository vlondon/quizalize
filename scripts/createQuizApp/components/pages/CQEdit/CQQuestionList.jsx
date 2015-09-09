/* @flow */
var React = require('react');
var router = require('./../../../config/router');
import CQEditNormal from './CQEditNormal';

var CQLatexString = require('react-latex');
import type {QuizComplete, Question} from './../../../stores/QuizStore';

type Props = {
    quiz: QuizComplete;
    handleSave: Function;
    questionIndex: number;
    handleQuestion: Function;
    handleRemoveQuestion: Function;
    setSaveMode: Function;
}

class CQQuestionList extends React.Component {

    props: Props;

    constructor(props:Props) {
        super(props);


        this.setSaveMode = this.setSaveMode.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleQuestion = this.handleQuestion.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    setSaveMode(canBeSaved: boolean) {
        this.props.setSaveMode(canBeSaved);
    }

    handleSave(){
        this.props.handleSave();
    }

    handleQuestion (question: Question){
        this.props.handleQuestion(question);
    }

    handleRemove(question: Question, event: Object){
        this.props.handleRemoveQuestion(question, event);
    }

    handleEdit(index : number){
        if (this.props.questionIndex !== index){
            router.setRoute(`/quiz/create/${this.props.quiz.uuid}/${index}`);
        }
    }

    canAddQuestion() : boolean {
        var {quiz} = this.props;
        // we filter questions with no content
        if (quiz.payload.questions){
            var emptyQuestions = quiz.payload.questions.filter( q => q.question.length === 0 || q.answer.length === 0);
        }
        console.log('emptyQuestions', emptyQuestions);
        return emptyQuestions.length === 0;
    }

    render() : any {

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

        var questionText = (question) => {
            if (question.latexEnabled) {
                return (<CQLatexString>{question.question}</CQLatexString>);
            }
            else {
                return (<span>{question.question}</span>);
            }
        };

        var answerText = (question) => {
            if (question.latexEnabled) {
                return (<CQLatexString>{question.answer}</CQLatexString>);
            }
            else {
                return (<span>{question.answer}</span>);
            }
        };

        if (this.props.quiz.payload.questions.length > 0) {

            questions = this.props.quiz.payload.questions.map((item, index) => {
                var editor = index === this.props.questionIndex ? questionEditor : undefined;
                var className = index === this.props.questionIndex ? 'cq-edit__quiz cq-edit__quiz--selected' : 'cq-edit__quiz cq-edit__quiz--unselected';



                return (
                    <div className={className} key={index} onClick={this.handleEdit.bind(this, index)}>
                        <div className="col-sm-6 cq-edit__listquestion">
                            <span className="label label-primary">Q</span>&nbsp;
                            {questionText(item)}
                        </div>
                        <div className="col-sm-4 cq-edit__listanswer">
                            <span className="label label-warning">A</span>&nbsp;
                            {answerText(item)}
                        </div>
                        <div className="col-sm-2 icons">

                            <button type='button' className="btn btn-info btn-xs">
                                <span className="glyphicon glyphicon-pencil"></span>
                            </button>
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
                        disabled={!this.canAddQuestion()}
                        onClick={this.handleSave}>
                        <span className="glyphicon glyphicon-plus"></span> Add a new question
                    </button>

                </div>
            </div>
        );
    }

}

CQQuestionList.propTypes = {
    quiz: React.PropTypes.object.isRequired,
    handleSave: React.PropTypes.func.isRequired,
    questionIndex: React.PropTypes.number,
    handleQuestion: React.PropTypes.func,
    handleRemoveQuestion: React.PropTypes.func,
    setSaveMode: React.PropTypes.func
};

module.exports = CQQuestionList;
