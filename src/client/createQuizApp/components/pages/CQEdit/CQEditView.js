/* @flow */
import React from 'react';

import router from './../../../config/router';

import CQSpinner from './../../../components/utils/CQSpinner';
import CQQuestionList from './CQQuestionList';
import CQAutofill from './../../../components/utils/CQAutofill';
import CQEditIcon from './CQEditIcon';
import CQPublishQuiz from './../../../components/utils/CQPublishQuiz';


import QuizStore from './../../../stores/QuizStore';
import TopicStore from './../../../stores/TopicStore';

import QuizActions from './../../../actions/QuizActions';
import AnalyticsActions from './../../../actions/AnalyticsActions';

import urlParams from './../../../utils/urlParams';
import type {QuizComplete, Question} from './../../../stores/QuizStore';

type Props = {
    routeParams: {
        questionIndex: ?string;
        quizId: string;
    };
    quiz: QuizComplete;
};

type State = {
    questionIndex?: number;
    quiz: QuizComplete;
    mode: string;
    saveEnabled: boolean;
    quizImageData?: string;
    quizImageFile?: Object;
};

export default class CQEditView extends React.Component {

    props: Props;
    state: State;

    constructor(props : Props) {
        super(props);
        this.state = {
            mode: 'Create',
            pristine: true,
            saveEnabled: true,
            quiz: this.props.quiz
        };
        var state = this.getState(props);
        state.mode = 'Create';
        state.saveEnabled = true;
        state.quiz = this.getQuiz();

        this.state = state;

        this.onChange = this.onChange.bind(this);
        this.handleSaveNewQuestion = this.handleSaveNewQuestion.bind(this);
        this.handleQuestion = this.handleQuestion.bind(this);
        this.handleRemoveQuestion = this.handleRemoveQuestion.bind(this);
        this.handleFinished = this.handleFinished.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.handleSaveButton = this.handleSaveButton.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.enableDisableSave = this.enableDisableSave.bind(this);
        this.getQuiz = this.getQuiz.bind(this);
        this.handleTopic = this.handleTopic.bind(this);
        this.handleName = this.handleName.bind(this);
        this.handleIcon = this.handleIcon.bind(this);
        this.handlePrePublish = this.handlePrePublish.bind(this);
    }

    getQuiz() : QuizComplete {
        var quizId = this.state && this.state.quiz ? this.state.quiz.uuid : this.props.routeParams.quizId;
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
        if (props) {
            this.setState(this.getState(props));
        }
    }

    getState(props : ?Props) : State {
        props = props || this.props;
        var state = Object.assign({}, this.state);
        var quiz = this.getQuiz(props);
        var questionIndex;

        if (quiz){
            quiz.payload.questions = quiz.payload.questions || [];

            if (props.routeParams.questionIndex) {
                questionIndex = parseInt(props.routeParams.questionIndex, 10);
            }

            if (
                quiz.payload.questions.length === 0 ||
                (
                    quiz.payload.questions.length === 1 &&
                    quiz.payload.questions[0].question === ''
                )
            ){
                questionIndex = 0;
            }

            // Check if the questionIndex is in range
            if (questionIndex && questionIndex > quiz.payload.questions.length){
                // console.warn('Trying to edit a question out of range');
                setTimeout(function(){
                    router.setRoute(`/quiz/create/${quiz.uuid}`);
                }, 550);
            }
        }
        state.quiz = quiz;
        state.questionIndex = questionIndex;
        console.info('CQEdit return state', state);
        return state;

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
        }
        this.save().then( ()=> {
            router.setRoute(`/quiz/create/${this.state.quiz.uuid}/${nextQuestion}`);
        });

    }

    save(){
        return QuizActions.newQuiz(this.state.quiz);
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
                console.log('about to remove question', this.state.questionIndex, quiz.payload.questions.length);
                this.setState({quiz}, ()=> {
                    QuizActions.newQuiz(quiz);
                    if (this.state.questionIndex && this.state.questionIndex >= quiz.payload.questions.length) {
                        router.setRoute(`/quiz/create/${this.state.quiz.uuid}/${quiz.payload.questions.length}`);
                    }
                });
            }
        });
    }

    handleShare() {
        if (this.state.quiz.payload.questions && this.state.quiz.payload.questions.length > 0 && this.state.quiz.payload.questions[0].question.length > 0) {

            AnalyticsActions.sendIntercomEvent('share_quiz', {uuid: this.state.quiz.uuid, name: this.state.quiz.meta.name});
            QuizActions.newQuiz(this.state.quiz).then( ()=> {
                router.setRoute(`/quiz/published/${this.state.quiz.uuid}/share`);
            });
        }
        else {
            swal("Whoops!", "You need to have at least one question before you can share this quiz");
        }
    }

    handleFinished() {
        if (this.state.quiz.payload.questions && this.state.quiz.payload.questions.length > 0 && this.state.quiz.payload.questions[0].question.length > 0) {
            AnalyticsActions.sendIntercomEvent('finish_quiz', {uuid: this.state.quiz.uuid, name: this.state.quiz.meta.name});
            QuizActions.newQuiz(this.state.quiz).then( ()=> {
                router.setRoute(`/quiz/published/${this.state.quiz.uuid}/assign`);
            });
        }
        else {
            swal("Whoops!", "You need to have at least one question before you can play this quiz in the class");
        }
    }

    handleSaveButton(){
        var {quiz} = this.state;
        var questionIndex = this.state.questionIndex || 0;
        if (quiz.payload.questions &&
            quiz.payload.questions.length > 0 &&
            quiz.payload.questions[questionIndex].question.length > 0 &&
            quiz.payload.questions[questionIndex].answer.length > 0) {
            QuizActions.newQuiz(quiz).then(()=>{
                swal("Quiz Saved!", "Your quiz has been saved!");
                router.setRoute(`/quiz/create/${this.state.quiz.uuid}`);
            });
        }
        else{
            if (this.state.questionIndex === (quiz.payload.questions.length - 1) && (quiz.payload.questions[questionIndex].question.length === 0 &&
            quiz.payload.questions[questionIndex].answer.length === 0) ) {
                //delete the last question
                if (quiz.payload.questions !== undefined) {
                    quiz.payload.questions.splice(questionIndex,1);
                }
                this.setState({quiz}, () => {
                    QuizActions.newQuiz(quiz).then(()=>{
                        swal("Quiz Saved!", "Your quiz has been saved!");
                        router.setRoute(`/quiz/create/${this.state.quiz.uuid}`);
                    });
                });
            }
            else {
                swal("Whoops!", "Please enter at least a question and an answer before saving the quiz");
            }
        }
    }

    handlePreview(){
        if (this.state.quiz.payload.questions && this.state.quiz.payload.questions.length > 0 && this.state.quiz.payload.questions[0].question.length > 0) {
            localStorage.setItem('mode', 'teacher');
            window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, 'preview');
            QuizActions.newQuiz(this.state.quiz).then( ()=> {
                window.open(`/app#/preview/${this.state.quiz.meta.profileId}/${this.state.quiz.uuid}`, 'preview');
            });
        }
        else{
            swal("Whoops!", "You need to have at least one question before you can play this quiz");
        }
    }

    handleName(ev:Object){
        var name = ev.target.value;
        var quiz = this.state.quiz;
        quiz.meta.name = name;
        this.setState({quiz});
    }


    enableDisableSave(saveEnabled: boolean){
        this.setState({saveEnabled});

        // <p className="small">
        //     Speed Tip: We found clicking is a pain - just hit enter to step through quickly
        // </p>
    }

    handleTopic(topicId: string){
        console.log('we got topic', topicId);
        var {quiz} = this.state;
        quiz.meta.categoryId = topicId;
        this.setState({quiz});
    }

    handleIcon(iconUrl: string) {
        var quiz = this.state.quiz;
        quiz.meta.imageUrl = iconUrl;
        this.setState({quiz}, ()=>{
            this.save();
        });
    }

    handlePrePublish(callback: Function) {
        QuizActions.newQuiz(this.state.quiz).then(callback);
    }

    render() : any {
        if (this.state.quiz){

            var placeholderForName = 'e.g. Enter a quiz name';
            var topics = TopicStore.getTopicTree();

            let pularlize = function(amount, singular, plural){
                if (amount === 1 || amount === 0) {
                    return singular;
                }
                return plural;
            };

            return (
                <div>
                    <div className="cq-edit__top">

                        <div className="cq-edit__icon">
                            <CQEditIcon quiz={this.state.quiz}
                                onIcon={this.handleIcon}/>
                        </div>
                        <div className="cq-edit__header">


                            <h3>Now editing quiz&nbsp;
                                <input
                                    type="text"
                                    className="cq-edit__input-header"
                                    value={this.state.quiz.meta.name}
                                    onChange={this.handleName}
                                    placeholder={placeholderForName}
                                />
                            </h3>

                            Using the topic&nbsp;
                            <CQAutofill
                                id="subject"
                                value={this.state.quiz.meta.categoryId}
                                onChange={this.handleTopic}
                                data={topics}
                                className="cq-edit__input-topic"
                                placeholder="e.g. Mathematics > Addition and Subtraction (Optional)"
                                identifier="topic"
                            />
                        </div>

                    </div>

                    <h4>You have {this.state.quiz.payload.questions.length} {pularlize(this.state.quiz.payload.questions.length, 'question', 'questions')}</h4>

                    <CQQuestionList
                        quiz={this.state.quiz}
                        questionIndex={this.state.questionIndex}
                        handleQuestion={this.handleQuestion}
                        handleRemoveQuestion={this.handleRemoveQuestion}
                        setSaveMode={this.enableDisableSave}
                        handleSave={this.handleSaveNewQuestion}/>

                    <div className="cq-edit__footer">
                        <div className="cq-edit__footer-inner cq-quizzes">

                            <CQPublishQuiz quiz={this.state.quiz} prePublished={this.handlePrePublish} className="cq-quizzes__button--publish"/>

                            <button className="cq-quizzes__button--share"
                                onClick={this.handleShare}>
                                <span className="fa fa-share"></span> Share
                            </button>

                            <button
                                target="zzishgame"
                                className="cq-quizzes__button--preview" onClick={this.handlePreview}>
                                <span className="fa fa-search"></span> Play
                            </button>

                            <button
                                className="cq-quizzes__button--assign" onClick={this.handleFinished}>
                                <span className="fa fa-users"></span> Play in class
                            </button>

                            <button
                                className="cq-quizzes__button--save"
                                onClick={this.handleSaveButton}>
                                <span className="fa fa-save"></span> Save
                            </button>

                        </div>
                    </div>

                </div>
            );
        } else {
            // add a loading animation
            return (
                <div>
                    <CQSpinner/>
                </div>);
        }
    }
}
CQEditView.propTypes = {
    routeParams: React.PropTypes.object,
    quiz: React.PropTypes.object.isRequired,
};
