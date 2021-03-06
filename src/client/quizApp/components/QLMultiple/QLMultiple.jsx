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



var QLMultiple = React.createClass({

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

    handleClick: function(index){

        this.handleCssState(2, () => {
            this.setState({
                answer: this.props.questionData.answerObject.alternatives[index]
            });
        });

        if (this.props.onSelect) {
            this.props.onSelect(this.props.questionData.answerObject.alternatives[index]);
        }
    },

    render: function() {
        var showAnswer, showQuestions, showCountdown;

        var latexWrapper = (string) => {
            if (this.props.questionData.latexEnabled) {
                return (<QLLatex>{string}</QLLatex>);
            } else {
                return (<span>{string}</span>);
            }
        };

        if (!this.state.answer) {
            var showTimer = this.props.currentQuiz.meta.showTimer == undefined ? true: this.props.currentQuiz.meta.showTimer == 1;
            showCountdown = <QLCountDown showCountdown={showTimer} startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
            showQuestions = this.props.questionData.answerObject.alternatives.map(function(alternative, index){
                return (
                <div className="alternative-wrapper" key={index}>
                    <button type="button" className={`btn alternative alternative-${index} wrapword`} onClick={this.handleClick.bind(this, index)}>
                        {latexWrapper(alternative)}
                    </button>
                </div>);
            }, this);
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
                    <div className="answers alternatives">
                        {showAnswer}
                        {showQuestions}
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLMultiple;
