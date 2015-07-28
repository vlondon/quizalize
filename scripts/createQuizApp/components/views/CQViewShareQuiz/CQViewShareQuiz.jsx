/* @flow */
import React from 'react';
import CQViewShareQuizInput from './CQViewShareQuizInput';

class CQViewShareQuiz extends React.Component {

    constructor(props : Object){
        super(props);
        this.state = {};
        this.handleInput = this.handleInput.bind(this);
    }


    handleInput(ev : Object){
        var emailList = ev.target.value;
        this.setState({ emailList });
    }

    handleEmailInput(emailList: Array<string>){
        console.log('we got', emailList);
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
                    <CQViewShareQuizInput onChange={this.handleInput}/>
                    <input
                        type="text"
                        className="form-control"
                        value={this.state.emailList}
                        onChange={this.handleInput}
                        placeholder="Enter a new class name"/>
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
