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
    quiz: QuizComplete
}
type Props = {};

export default class CQViewQuizDetails extends React.Component {

    static propTypes = {
        quizId: React.PropTypes.string.isRequired,
        quizCode: React.PropTypes.string,
        onClose: React.PropTypes.func.isRequired
    };

    constructor(props: Props) {
        super(props);
        this.state = this.getState();

        this.keyUpListener = this.keyUpListener.bind(this);
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
        var state = {
            quiz: QuizStore.getPublicQuiz(this.props.quizId)
        };

        return state;
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
        if (this.state.quiz) {
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
            } else {
                TransactionActions.buyQuiz(this.state.quiz);
            }
        }
    }

    render() : any {

        var quizInfo;
        var tagLine = () => {
            // this.state.quiz.meta.price = 3;
            if (this.state.quiz.meta.price && this.state.quiz.meta.price > 0) {
                return (<span>Play in class for {priceFormat(this.state.quiz.meta.price, "$", "us")}</span>);
            }
            else {
                return (<span>Play in class</span>);
            }
        };


        if (this.state.quiz){
            quizInfo = (
                <div className="cq-quizdetails__cardinner">
                    <div className="cq-quizdetails__info">
                        <h5>
                            {TopicStore.getTopicName(this.state.quiz.meta.publicCategoryId || this.state.quiz.meta.categoryId)}
                        </h5>
                        <h1>{this.state.quiz.meta.name}</h1>

                        <p>
                        <i>
                            {this.state.quiz.payload.questions.length} questions.
                        </i>
                        </p>

                        <button className="cq-quizdetails__button" onClick={this.handlePreview.bind(this, this.state.quiz)}>
                            Play
                        </button>

                        <button className="cq-quizdetails__button" onClick={this.handleBuy}>
                            {tagLine()}
                        </button>
                    </div>

                    <div className="cq-quizdetails__questionscroller">
                        <div className="cq-quizdetails__questions">
                            <ul>

                                {this.state.quiz.payload.questions.map( (question, index) => {
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
