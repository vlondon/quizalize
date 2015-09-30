var React = require('react');

var QLAnswerScreen = require('quizApp/components/QLAnswerScreen');
var QLCountDown = require('quizApp/components/QLCountDown');
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
var isDragging = false;
var _domElement;
var getCoordinates = function(e){
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    x -= _domElement.offsetLeft;
    y -= _domElement.offsetTop;

    return {x, y};
};

var getDraggableStyle = function(coordinates){
    var newStyle = {
        WebkitTransform: `translate(${coordinates.x - 140 / 2}px, ${coordinates.y - 140 / 2}px)`,
        MozTransform: `translate(${coordinates.x - 140 / 2}px, ${coordinates.y - 140 / 2}px)`,
        msTransform: `translate(${coordinates.x - 140 / 2}px, ${coordinates.y - 140 / 2}px)`,
        transform: `translate(${coordinates.x - 140 / 2}px, ${coordinates.y - 140 / 2}px)`
    };
    return newStyle;
};

var QLScrambled = React.createClass({

    propTypes: {
        question: React.PropTypes.string.isRequired,
        letters: React.PropTypes.array.isRequired,
        onAddLetter: React.PropTypes.func,
        quizData: React.PropTypes.object,
        startTime: React.PropTypes.number,
    },

    getInitialState: function() {
        var state =  {
            cssState: cssStates[cssStateIndex],
            answered: null,
            startTime: Date.now(),
            solution: []
        };
        state.solution.length = this.props.letters.length;
        return state;
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
        _domElement = this.refs.main;
        cssStateIndex = 0;
        setTimeout(() => {
            this.handleCssState(cssStateIndex++);
        }, this.state.cssState.duration);
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
    },

    handleResize: function(){
        this.handleResizeOptions();
        this.handleResizeQuestion();
    },

    handleResizeQuestion: function(){
        var splitPointQuestion;
        var optionSize = 60;
        var containerPadding = 20;
        var numOptions = this.props.letters.length;
        var spaceAvailable = React.findDOMNode(this.refs.userInteraction).offsetWidth - (containerPadding * 2);


        var howManyOptionsFit = spaceAvailable / optionSize;

        if (howManyOptionsFit < numOptions) {
            // we'll try with two rows
            var twoRows = (numOptions / 2) * optionSize;
            if (twoRows < spaceAvailable) {
                splitPointQuestion = Math.ceil(numOptions / 2);
            } else {
                splitPointQuestion = Math.ceil(numOptions / 3);
            }
        }
        this.setState({splitPointQuestion});

    },

    handleResizeOptions: function(){
        var splitPoint;
        var optionSize = 70;
        var containerPadding = 20;
        var numOptions = this.props.letters.length;
        var spaceAvailable = React.findDOMNode(this.refs.userInteraction).offsetWidth - (containerPadding * 2);


        var howManyOptionsFit = spaceAvailable / optionSize;

        if (howManyOptionsFit < numOptions) {
            // we'll try with two rows
            var twoRows = (numOptions / 2) * optionSize;
            if (twoRows < spaceAvailable) {
                splitPoint = Math.ceil(numOptions / 2);
            } else {
                splitPoint = Math.ceil(numOptions / 3);
            }
        }
        this.setState({splitPoint});

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
        this.props.onAddLetter(index);
    },


    handleRemoveLetter: function(index){
        this.props.onRemoveLetter(index);
    },

    render: function() {

        var showAnswer, showTargets, showOptions, showCountdown;

        if (this.props.letters.length > 0) {
            showCountdown = <QLCountDown startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
            showTargets = this.props.answer.map(function(letter, index){
                var selected = letter === "AAA" ? "btn-info": "btn-danger";
                return (
                    <button className={`letterTile ng-binding ng-scope solution ${selected}`}
                        onClick={this.handleRemoveLetter.bind(this, index)}
                        key={index}>
                        {letter === "AAA" ? "_": letter}
                    </button>
                );
            }, this);

            showOptions = this.props.letters.map(function(letter, index){
                return (
                    <button className="letterTile btn-primary ng-binding ng-scope option" key={index} onClick={this.handleClick.bind(this, index)}>{letter}</button>
                );
            }, this);

            if (this.state.splitPoint) {
                showOptions.splice(this.state.splitPoint, 0, <br/>);
            }
            if (this.state.splitPointQuestion) {
                showTargets.splice(this.state.splitPointQuestion, 0, <br/>);
            }
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
            <div className='ql-quiz-container' ref='main'>
                <div className={`ql-question ql-scrambled ${this.state.cssState.name}`}>
                    <h3 className='question'>
                        {this.props.question}
                    </h3>
                    {this.props.imageURL ? <QLImage src={this.props.imageURL} className='ql-question-img'/> : null}
                    {showCountdown}
                    <div className="answers options">
                        {showAnswer}
                        {showTargets}
                        <div className="user-interaction" ref='userInteraction'>
                            {!showAnswer ? <div>Unscramble the letters below to find the correct answer</div> : null}
                            {showOptions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLScrambled;
