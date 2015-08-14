/* @flow */
import React from 'react';

import router from './../../../config/router';

import CQPageTemplate from './../../../components/CQPageTemplate';
import CQQuestionList from './CQQuestionList';
import CQLink from './../../../components/utils/CQLink';
import CQAutofill from './../../../components/utils/CQAutofill';

import QuizStore from './../../../stores/QuizStore';
import type {QuizComplete, Question} from './../../../stores/QuizStore';
import QuizActions from './../../../actions/QuizActions';

import TopicStore from './../../../stores/TopicStore';
import UserApi from './../../../actions/api/UserApi';

import urlParams from './../../../utils/urlParams';

type Props = {
    quizId: ?string;
    questionIndex: ?string;
};

type State = {
    questionIndex?: number;
    quiz: QuizComplete;
    mode: string;
    pristine: boolean;
    saveEnabled: boolean;
}

export default class CQEdit extends React.Component {

    props: Props;
    state: State;

    constructor(props : Props) {
        super(props);
        this.state = {
            mode: 'Create',
            pristine: true,
            saveEnabled: true,
            quiz: this.getQuiz()
        };
        this.onChange = this.onChange.bind(this);
        this.handleSaveNewQuestion = this.handleSaveNewQuestion.bind(this);
        this.handleQuestion = this.handleQuestion.bind(this);
        this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
        this.handleFinished = this.handleFinished.bind(this);
        this.handleSaveButton = this.handleSaveButton.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.enableDisableSave = this.enableDisableSave.bind(this);
        this.getQuiz = this.getQuiz.bind(this);
    }

    getQuiz() : QuizComplete {
        var quizId = this.state && this.state.quiz ? this.state.quiz.uuid : this.props.quizId;
        var quiz = QuizStore.getQuiz(quizId);
        return quiz;
    }

    componentWillMount() {
        var p = urlParams();
        if (this.state.quiz && this.state.quiz.meta.categoryId === undefined && p.c) {
            var quiz = this.state.quiz;
            quiz.meta.categoryId = p.c;

            this.setState({quiz});
        }
    }



    componentDidMount() {
        TopicStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        TopicStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps : Props) {
        this.onChange(nextProps);
    }

    onChange(props : ?Props){

        props = props || this.props;

        // TODO: we need to load the quiz without having to worry about
        // if the quiz store have finished loading

        if (props) {

            var quiz = this.getQuiz(props);
            var questionIndex;


            if (quiz){
                quiz.payload.questions = quiz.payload.questions || [];

                if (props.questionIndex) {
                    questionIndex = parseInt(props.questionIndex, 10);
                } else if (quiz.payload.questions.length === 0 && this.state.questionIndex === undefined){
                    questionIndex = 0;
                }

                // Check if the questionIndex is in range
                if (questionIndex && questionIndex > quiz.payload.questions.length){
                    console.warn('Trying to edit a question out of range');
                    setTimeout(function(){
                        router.setRoute(`/quiz/create/${quiz.uuid}`);
                    }, 550);
                }
            }
            this.setState({ quiz, questionIndex });
        }
    }

    handleQuestion(question : Question){
        // question update
        var quiz = Object.assign({}, this.state.quiz);


        var index = 0;
        if (this.state.questionIndex){
            index = this.state.questionIndex;
        }

        if (index === undefined && this.state.quiz) {
            index = this.state.quiz.payload.questions.length;
        }

        quiz.payload.questions[index] = question;
        this.setState({
            pristine: false,
            quiz
        });
    }

    handleSaveNewQuestion(){
        // new question

        var nextQuestion;
        if (this.state.questionIndex) {
            nextQuestion = this.state.questionIndex + 1;
        } else if (this.state.quiz) {
            nextQuestion = this.state.quiz.payload.questions.length;
            console.log('state quiz', this.state.quiz, `/quiz/create/${this.state.quiz.uuid}/${nextQuestion}`);
            router.setRoute(`/quiz/create/${this.state.quiz.uuid}/${nextQuestion}`);
            // QuizActions.newQuiz(this.state.quiz).then( ()=> {
            // });
        }

    }

    handleRemoveQuestion(question : Question, event : Object){
        event.stopPropagation();
        swal({
                title: 'Confirm Delete',
                text: 'Are you sure you want to permanently delete this question?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }, (isConfirm) => {
            if (isConfirm){
                var questionIndex = this.state.quiz.payload.questions.indexOf(question);
                var quiz = Object.assign({}, this.state.quiz);
                quiz.payload.questions = this.state.quiz.payload.questions;
                quiz.payload.questions.splice(questionIndex, 1);
                console.log('about to remove question', quiz.payload.questions);
                this.setState({quiz}, ()=> QuizActions.newQuiz(this.state.quiz) );
            }
        });
    }

    handleFinished(){
        UserApi.trackEvent('finish_quiz', {uuid: this.state.quiz.uuid, name: this.state.quiz.meta.name});
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            router.setRoute(`/quiz/published/${this.state.quiz.uuid}`);
        });
    }

    handleSaveButton(){
        QuizActions.newQuiz(this.state.quiz).then(()=>{
            router.setRoute(`/quiz/create/${this.state.quiz.uuid}`);
            this.setState({pristine: true});
        });
    }

    handlePreview(){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, 'preview');
        QuizActions.newQuiz(this.state.quiz).then( ()=> {
            window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, 'preview');
        });
    }

    enableDisableSave(saveEnabled: boolean){
        this.setState({saveEnabled});
    }

    render() {

        if (this.state.quiz){

            var previewEnabled = this.state.quiz.payload.questions && this.state.quiz.payload.questions.length > 0;

            return (
                <CQPageTemplate className="cq-container cq-edit">

                    <div className="cq-edit__header">
                        <h3>Now editing quiz&nbsp;
                            <span style={{color: 'red'}}>{this.state.quiz.meta.name}</span>
                            <CQLink href={`/quiz/edit/${this.state.quiz.uuid}`}>
                                <button className="btn btn-sm btn-info">
                                    <span className="glyphicon glyphicon-cog"> </span>
                                </button>
                            </CQLink>
                        </h3>
                        <p className="small">
                            Speed Tip: We found clicking is a pain - just hit enter to step through quickly
                        </p>
                        <CQAutofill
                            value={this.state.quiz.meta.categoryId}
                            onChange={this.handleTopic}
                            data={TopicStore.getTopicTree}
                            placeholder="e.g. Mathematics > Addition and Subtraction (Optional)"
                            tabIndex="2"/>
                    </div>


                    <h4>Your questions</h4>

                    <CQQuestionList
                        quiz={this.state.quiz}
                        questionIndex={this.state.questionIndex}
                        handleQuestion={this.handleQuestion}
                        handleRemoveQuestion={this.handleRemoveQuestion}
                        setSaveMode={this.enableDisableSave}
                        handleSave={this.handleSaveNewQuestion}/>

                    <div className="cq-edit__footer">
                        <div className="cq-edit__footer-inner">

                            <button onClick={this.handlePreview}
                                disabled={!previewEnabled}

                                target="zzishgame"
                                className="btn btn-info">
                                Preview
                            </button>

                            <button
                                disabled={!previewEnabled || this.state.pristine || !this.state.saveEnabled}
                                className="btn btn-primary"
                                onClick={this.handleSaveButton}>
                                Save
                            </button>

                            <button
                                disabled={!previewEnabled}
                                className="btn btn-primary"
                                onClick={this.handleFinished}>
                                Let's finish!
                            </button>

                        </div>
                    </div>

                </CQPageTemplate>
            );
        } else {
            // add a loading animation
            return (<div>Loading</div>);
        }
    }
}
CQEdit.propTypes = {
    quizId: React.PropTypes.string
};
