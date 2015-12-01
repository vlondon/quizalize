/* @flow */
var React = require('react');

var QLQuestion = require('./../../components/QLQuestion');
var QLAnswerScreen = require('./../../components/QLAnswerScreen');
var QLCountDown = require('./../../components/QLCountDown');
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



var QLBoolean = React.createClass({

    propTypes: {
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
            answer: null
        };
    },

    componentWillReceiveProps: function(nextProps: Object) {
        if (this.props.questionData !== nextProps.questionData) {
            this.setState({
                cssSate: cssStates[0]
            });
        }
    },

    componentWillMount: function() {
        cssStateIndex = 0;
    },

    componentDidMount: function() {
        let duration = this.state.cssState.duration || 0;
        setTimeout(() => {
            this.handleCssState(cssStateIndex++);
        }, duration);
    },

    handleCssState: function(newCssStateIndex: number, cb: ?Function) {
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

    handleClick: function(answer: string){
        new Howl({
            urls: ['/sounds/button_press.mp3'],
            onend: function() {
                this.unload();
            }
        }).play();
        
        this.handleCssState(2, () => {
            this.setState({answer});
        });

        if (this.props.onSelect) {
            this.props.onSelect(answer);
        }
    },

    render: function(): any {
        var showAnswer, showQuestions, showCountdown;

        if (cssStateIndex === 0) {
            return (<div></div>);
        } else if (!this.state.answer) {
            var showTimer = this.props.currentQuiz.meta.showTimer == undefined ? true: this.props.currentQuiz.meta.showTimer == 1;
            showCountdown = <QLCountDown showCountdown={showTimer} startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
            showQuestions = ["true", "false"].map(function(alternative, index){
                return (
                <div className="alternative-wrapper" key={index}>
                    <button type="button" className={`btn alternative alternative wrapword`} onClick={this.handleClick.bind(this, alternative)}>
                        {alternative}
                    </button>
                </div>);
            }, this);
        } else {
            var questionId = this.props.questionData.uuid;
            var currentAnswerFilter = this.props.quizData.report.filter(f=> f.questionId === questionId);
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
                <div className={`ql-question ql-boolean ${this.state.cssState.name}`}>
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

module.exports = QLBoolean;
