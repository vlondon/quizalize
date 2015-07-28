var React = require('react');

var QLAnswerScreen = require('quizApp/components/QLAnswerScreen');
var QLCountDown = require('quizApp/components/QLCountDown');
var QLLatex = require('quizApp/components/QLLatex');

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
        question: React.PropTypes.string.isRequired,
        alternatives: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func,
        onNext: React.PropTypes.func,
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
            startTime: Date.now(),
            hasLatex: this.props.currentQuiz.latexEnabled
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

    handleClick: function(index){

        this.handleCssState(2, () => {
            this.setState({
                answer: this.props.alternatives[index]
            });
        });

        if (this.props.onSelect) {
            this.props.onSelect(index);
        }
    },

    render: function() {

        var latexWrapper = (string) => {
            if (this.props.latexEnabled) {
                return (<QLLatex>{string}</QLLatex>);
            } else {
                return (<span>{string}</span>);
            }
        }

        var showAnswer, showQuestions, showCountdown;

        if (!this.state.answer) {
            showCountdown = <QLCountDown startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
            showQuestions = this.props.alternatives.map(function(alternative, index){
                return (
                <div className="alternative-wrapper" key={index}>
                    <button type="button" className={`btn alternative alternative-${index} wrapword`} onClick={this.handleClick.bind(this, index)}>
                        {latexWrapper(alternative)}
                    </button>
                </div>);
            }, this);
        } else {
            var currentAnswer = this.props.quizData.report[this.props.quizData.report.length - 1];
            showAnswer = (
                <QLAnswerScreen
                    questionData={this.props.questionData}
                    answerData={currentAnswer}
                    onNext={this.props.onNext}/>
            );
        }

        return (
            <div className='ql-quiz-container'>
                <div className={`ql-question ql-multiple ${this.state.cssState.name}`}>
                    <p className='question'>

                        {latexWrapper(this.props.question)}

                    </p>
                    {this.props.imageURL && this.props.imageEnabled ? <img src={this.props.imageURL} className='ql-question-img'/> : null}
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
