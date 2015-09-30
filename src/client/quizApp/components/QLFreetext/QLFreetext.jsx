var React = require('react');

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
        question: React.PropTypes.string.isRequired,
        onSelect: React.PropTypes.func,
        onNext: React.PropTypes.func,
        attributes: React.PropTypes.object,
        quizData: React.PropTypes.object,
        questionData: React.PropTypes.object,
        currentQuiz: React.PropTypes.object,
        imageURL: React.PropTypes.string,
        latexEnabled: React.PropTypes.bool,
        imageEnabled: React.PropTypes.bool,
        startTime: React.PropTypes.number,
    },

    getInitialState: function() {
        console.log('currentQuiz', this.props.currentQuiz);

        return {
            cssState: cssStates[cssStateIndex],
            answered: null,
            startTime: Date.now()
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (this.props.question !== nextProps.question) {
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

        var latexWrapper = (string) => {
            if (this.props.latexEnabled) {
                return (<QLLatex>{string}</QLLatex>);
            } else {
                return (<span>{string}</span>);
            }
        };

        var showAnswer, showQuestions, showCountdown;

        if (!this.state.answer) {
            showCountdown = <QLCountDown startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
                showQuestions = (
                    <div>
                        <input type="text" name="freetextInputAnswer" id="freetextInputAnswer"/>
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
                    questionData={this.props.questionData}
                    answerData={currentAnswerFilter[0]}
                    onNext={this.props.onNext}/>
            );
        }

        var questionText;
        if (this.props.questionData.questionObject.type == "audio") {
            questionText = (
                <audio controls="true" autoPlay>
                    <source src={this.props.questionData.questionObject.url} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>);
        }
        else {
            questionText = this.props.questionData.questionObject.url;
        }

        return (
            <div className='ql-quiz-container'>
                <div className={`ql-question ql-multiple ${this.state.cssState.name}`}>
                    <p className='question'>
                        {questionText}
                    </p>
                    {this.props.imageURL && this.props.imageEnabled ? <QLImage src={this.props.imageURL} className='ql-question-img'/> : null}
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
