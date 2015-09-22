/* @flow */
import React from 'react';
import router from './../../../config/router';
import type {Quiz} from './../../../stores/QuizStore';
import QuizActions from './../../../actions/QuizActions';

import CQViewShareQuizInput from './CQViewShareQuizInput';

type Props = {
    quiz: Quiz
};
class CQViewShareQuiz extends React.Component {

    props: Props;

    constructor(props : Props){
        super(props);
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
        this.handleEmailInput = this.handleEmailInput.bind(this);
        this.sendShare = this.sendShare.bind(this);
        QuizActions.loadQuiz(props.quizId).then( (quiz) => {
            this.setState({
                quiz
            });
            if (quiz.payload.questions.length === 0) {
                swal({
                    title: "Error",
                    text: "You need at least one question in order to be able to share this quiz",
                    confirmButtonText: 'Edit quiz',
                },function() {
                    router.setRoute(`/quiz/create/${quiz.uuid}`);
                });
            }
        });
    }

    handleInput(ev : Object){
        var emailList = ev.target.value;
        this.setState({ emailList });
    }

    handleEmailInput(emailList: Array<string>){
        console.log('we got', emailList);
        this.setState({emailList});
    }

    sendShare(){
        console.log('about to send', this.state.emailList);
        QuizActions.shareQuiz(this.state.quiz, this.state.quiz.meta.name, this.state.emailList)
            .then(()=> {
                swal({
                    title: 'Quiz shared!',
                    text: `We'll email your colleagues with a link so they can use it in Quizalize!`,
                    type: 'success'
                }, ()=>{
                    router.setRoute(`/quiz/quizzes`);
                });

            });


    }


    render () : any {
        return (
            <div className='cq-sharequiz'>
                <h3>
                    <span className="cq-viewclass__icon">
                        <i className="fa fa-users"></i>
                    </span> Share with colleagues (they use it free…)
                </h3>
                <div className="cq-viewclass__list">
                    <CQViewShareQuizInput onChange={this.handleEmailInput}/>

                    <button
                        className={this.state.canSaveNewClass ? "btn btn-primary" : "btn btn-primary"}
                        type="submit"
                        onClick={this.sendShare}>
                        Share the quiz
                    </button>
                </div>
            </div>
        );
    }
}
CQViewShareQuiz.propTypes = {
    quizId: React.PropTypes.string
};

export default CQViewShareQuiz;
