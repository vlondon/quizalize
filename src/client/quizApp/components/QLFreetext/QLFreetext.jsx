var React = require('react');

var QLQuestion = require('quizApp/components/QLQuestion');
var QLAnswerScreen = require('quizApp/components/QLAnswerScreen');
var QLCountDown = require('quizApp/components/QLCountDown');
var QLLatex = require('quizApp/components/QLLatex');
var QLImage = require('./../QLImage');

var cssStates = [
    {
        name: 'enter',
        duration: 1000
    },
    {
        name: ''
    },
    {
        name: 'exit',
        duration: 500
    }
];

var cssStateIndex = 0;

var QLFreetext = React.createClass({

    propTypes: {
        questionIndex: React.PropTypes.number.isRequired,
        currentQuiz: React.PropTypes.object.isRequired,
        quizData: React.PropTypes.object.isRequired,
        questionData: React.PropTypes.object.isRequired,
        startTime: React.PropTypes.number.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired
    },

    getInitialState: function() {
        console.log('currentQuiz', this.props.currentQuiz);

        return {
            cssState: cssStates[cssStateIndex],
            answer: this.props.quizData.report[this.props.questionIndex] ? this.props.quizData.report[this.props.questionIndex].answer : null
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.questionData !== nextProps.questionData) {
            this.setState({
                cssSate: cssStates[0]
            });
        }
    },

    componentDidMount: function() {
        cssStateIndex = 0;
        setTimeout(() => {
            this.handleCssState(cssStateIndex++);
        }, this.state.cssState.duration);
    },

    handleCssState: function(newCssStateIndex, cb){
        var newCssState = cssStates[newCssStateIndex];
        if (newCssState){
            this.setState({
                cssState: newCssState
            });
            if (newCssState.duration){
                setTimeout(()=>{
                    if (cb) { cb(); }
                    if (newCssStateIndex + 1 < cssStates.length) {
                        this.handleCssState(newCssStateIndex + 1);
                    } else {
                        cssStateIndex = 0;
                    }
                }, newCssState.duration);
            }
        }
    },

    handleClick: function(){

        var answer = $("#freetextInputAnswer").val();

        this.handleCssState(2, () => {
            this.setState({answer});
        });

        if (this.props.onSelect) {
            this.props.onSelect(answer);
        }
    },

    render: function() {

        var showAnswer, showQuestions, showCountdown;

        if (!this.state.answer) {
            showCountdown = <QLCountDown showCountdown={this.props.currentQuiz.meta.showTimer || true} startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
            showQuestions = (
                <div className="freetext">
                    <input type="text" name="freetextInputAnswer" id="freetextInputAnswer"/>
                    &nbsp;
                    <button type="button" className="btn" onClick={this.handleClick}>
                        Submit
                    </button>
                </div>);
        } else {
            var questionId = this.props.questionData.uuid;
            var currentAnswerFilter = this.props.quizData.report.filter(function(f) {
                return f.questionId == questionId;
            });
            showAnswer = (
                <QLAnswerScreen
                    currentQuiz={this.props.currentQuiz}
                    questionData={this.props.questionData}
                    answerData={currentAnswerFilter[0]}
                    onNext={this.props.onNext}/>
            );
        }

        return (
            <div className='ql-quiz-container'>
                <div className={`ql-question ql-multiple ${this.state.cssState.name}`}>
                    <QLQuestion
                        questionData={this.props.questionData}
                    />
                    {this.props.questionData.imageURL ? <QLImage src={`https://d15tuytjqnsden.cloudfront.net/${this.props.questionData.imageURL}`} className='ql-question-img'/> : null}
                    {showCountdown}
                    <div className="answers">
                        {showAnswer}
                        {showQuestions}
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLFreetext;
