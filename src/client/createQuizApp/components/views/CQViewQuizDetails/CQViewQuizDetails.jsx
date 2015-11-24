/* @flow */
import React from "react";
import router from "./../../../config/router";

import {
    CQSpinner,
    CQLatexString
} from "./../../../components";

import {
    QuizStore,
    TopicStore,
    MeStore
} from "./../../../stores";

import {
    TransactionActions
} from "./../../../actions";


var timeouts = [];
import {priceFormat} from "./../../../utils";
import type {QuizComplete} from "./../../../../../types";

type State = {
    quiz: ?QuizComplete;
    removed?: Boolean;
}
type Props = {
    quizId: string;
    onClose: Function;
};

const isLoggedIn = () => {
    if (!MeStore.isLoggedIn()){
        swal({
            title: "You need to be logged in",
            text: `In order to buy this item you need to log into Quizalize`,
            type: "info",
            confirmButtonText: "Log in",
            showCancelButton: true
        }, function(isConfirm){
            if (isConfirm){
                router.setRoute(`/quiz/login?redirect=${window.encodeURIComponent("/quiz/marketplace")}`);
            }
        });
        return false;
    } else {
        return true;
    }
};

export default class CQViewQuizDetails extends React.Component {

    state: State;
    props: Props;

    static propTypes = {
        quizId: React.PropTypes.string.isRequired,
        quizCode: React.PropTypes.string,
        onClose: React.PropTypes.func.isRequired
    };

    constructor(props: Props) {
        super(props);

        this.getState = this.getState.bind(this);
        this.keyUpListener = this.keyUpListener.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handleBuy = this.handleBuy.bind(this);
        this.handleSaveForLater = this.handleSaveForLater.bind(this);
        this.handleHomework = this.handleHomework.bind(this);

        this.state = this.getState();
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        document.addEventListener("keyup", this.keyUpListener);
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
        document.removeEventListener("keyup", this.keyUpListener);
        timeouts.forEach( t => clearTimeout(t));
    }

    keyUpListener(ev: Object){
        if (ev.keyCode === 27) {
            this.handleClose();
        }
    }

    onChange(){
        this.setState(this.getState());
    }

    getState() : State {
        let quiz = QuizStore.getPublicQuiz(this.props.quizId);
        console.log("quiz", quiz, this.props.quizId);
        return {quiz};
    }

    handleClose(){
        if (this.state.closed !== true) {
            this.setState({closed: true});

            timeouts.push(setTimeout(()=>{

                this.setState({removed: true}, ()=> {
                    this.props.onClose();
                });
            }, 350));
        }
    }

    handlePreview(quiz : QuizComplete){
        sessionStorage.setItem("mode", "preview");
        window.open(`/app#/play/public/${quiz.uuid}`);
    }

    handleBuy(){

        if (isLoggedIn()){
            if (this.state.quiz){
                TransactionActions.buyQuiz(this.state.quiz);
            }
        }

    }

    handleEdit(){
        if (isLoggedIn()){
            if (this.state.quiz){
                TransactionActions.buyQuiz(this.state.quiz, false, false)
                    .then((quiz)=>{
                        console.log("we got quiz?", quiz);
                        router.setRoute(`/quiz/create/${quiz.uuid}`);
                    });
            }
        }
    }

    handleSaveForLater(){
        if (isLoggedIn()){
            if (this.state.quiz){
                TransactionActions.buyQuiz(this.state.quiz, false, false)
                    .then(()=>{
                        // TODO Francesco please review the copy
                        swal({
                            title: "Quiz saved for later",
                            text: `The quiz has been saved in your profile`,
                            type: "info",
                            confirmButtonText: "Got it",
                            showCancelButton: false
                        });
                    });
            }
        }
    }

    handleHomework(){
        if (isLoggedIn()){
            if (this.state.quiz){
                TransactionActions.buyQuiz(this.state.quiz, false, false)
                    .then((quiz)=>{
                        router.setRoute(`/quiz/published/${quiz.uuid}/assign?homework=true`);
                    });
            }
        }
    }

    render() : any {

        var quizInfo;

        if (this.state.quiz){
            let tagLine;
            let name = this.state.quiz.meta.name;
            let questionLength = this.state.quiz.payload.questions.length;
            let quiz = this.state.quiz;
            let quizid = QuizStore.getOwnedQuizByOriginalQuizId(quiz.uuid);
            console.log("owned quiz? , quizId", quizid);

            if (quiz.meta.price && quiz.meta.price > 0) {
                tagLine = (<span>Play in class for {priceFormat(quiz.meta.price, "$", "us")}</span>);
            } else {
                tagLine = (<span>Play in class</span>);
            }

            quizInfo = (
                <div className="cq-quizdetails__cardinner">
                    <div className="cq-quizdetails__info">
                        <h5>
                            {TopicStore.getTopicName(quiz.meta.publicCategoryId || quiz.meta.categoryId)}
                        </h5>
                        <h1>{name}</h1>
                        <i>
                            {questionLength} questions.
                        </i>

                    </div>

                    <div className="cq-quizdetails__extra">
                        <div className="cq-quizdetails__extra__questionholder">

                            <div className="cq-quizdetails__questionscroller">
                                <div className="cq-quizdetails__questions">
                                    <ul>

                                        {quiz.payload.questions.map( (question, index) => {
                                            return (
                                                <li className="cq-quizdetails__question" key={question.uuid}>
                                                    {index + 1}. <CQLatexString>{question.question}</CQLatexString>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="cq-quizdetails__extra__buttons">
                            <a className="cq-quizdetails__preview" onClick={this.handlePreview.bind(this, quiz)}>
                                Preview  - try it!
                            </a>

                            <button className="cq-quizdetails__button__main cq-quizdetails__button__main--big" onClick={this.handleBuy}>
                                {tagLine}
                            </button>

                            <button className="cq-quizdetails__button__main" onClick={this.handleHomework}>
                                Set as homework
                            </button>

                            <button className="cq-quizdetails__button__alt" onClick={this.handleEdit}>
                                Edit questions
                            </button>

                            <button className="cq-quizdetails__button__alt" onClick={this.handleSaveForLater}>
                                Save for later
                            </button>



                        </div>

                    </div>
                </div>
            );
        } else {
            quizInfo = (<CQSpinner/>);
        }

        if (this.state.removed !== true){

            return (
                <div className={this.state.closed ? `cq-quizdetails closed` : `cq-quizdetails`}>
                    <div className="cq-quizdetails__card">
                        <div className="cq-quizdetails__close fa fa-times" onClick={this.handleClose}></div>
                        {quizInfo}
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

};
