/* @flow */
var React = require('react');
var Howl = require('howler').Howl;

var QLQuestion = require('./../../components/QLQuestion');
var QLAnswerScreen = require('./../../components/QLAnswerScreen');
var QLCountDown = require('./../../components/QLCountDown');
var QLLatex = require('./../../components/QLLatex');

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

    componentWillReceiveProps: function(nextProps: Object) {
        if (this.props.questionData !== nextProps.questionData) {
            let hasAnswer = nextProps.quizData.report[nextProps.questionIndex] ? nextProps.quizData.report[nextProps.questionIndex].answer : null;
            this.setState({
                answer: hasAnswer
            });
            if (!hasAnswer) {
                this.handleCssState(0);
            }
        }
    },

    componentWillMount: function() {
        cssStateIndex = 0;
    },

    componentDidMount: function() {
        setTimeout(() => {
            this.handleCssState(cssStateIndex++);
        }, this.state.cssState.duration || 0);
    },

    handleCssState: function(newCssStateIndex: number, cb: ?Function){
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

    handleClick: function(index: number){
        // Playing sound: Button press
        new Howl({
            urls: ['/sounds/button_press.mp3'],
            onend: function() {
                this.unload();
            }
        }).play();

        this.handleCssState(2, () => {
            this.setState({
                answer: this.props.questionData.answerObject.alternatives[index]
            });
        });

        if (this.props.onSelect) {
            this.props.onSelect(this.props.questionData.answerObject.alternatives[index]);
        }
    },

    render: function(): any{
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
            //console.info('Show Ansnwer');
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
                <div className={`ql-question ql-multiple ${this.state.cssState.name || "0"}`}>
                    <QLQuestion
                        questionData={this.props.questionData}
                    />
                    {this.props.questionData.imageURL ? <QLImage src={this.props.questionData.imageURL} className='ql-question-img'/> : null}
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
