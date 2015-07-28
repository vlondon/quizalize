/* @flow */
import React from 'react';
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
        QuizActions.shareQuiz(this.props.quiz, this.props.quiz.meta.name, this.state.emailList);

        //shareQuiz: function(quizId:string, quizName:string, emailList:Array<string>, link:string){
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
                        Create and use in class
                    </button>
                </div>
            </div>
        );
    }
}
CQViewShareQuiz.propTypes = {
    quiz: React.PropTypes.obj
};

export default CQViewShareQuiz;
