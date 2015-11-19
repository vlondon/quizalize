/* @flow */

var React = require('react');

var randomise = require('./../../utils/randomise');
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

var QLLinking = React.createClass({

    propTypes: {
        currentQuiz: React.PropTypes.object.isRequired,
        quizData: React.PropTypes.object.isRequired,
        questionData: React.PropTypes.object.isRequired,
        startTime: React.PropTypes.number.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired,
        questionIndex: React.PropTypes.number
    },

    getInitialState: function() {
        var targetSelected = this.props.questionData.answerObject.targetArray.map(item => ({text: item, state: "unselected"}));
        var optionSelected = this.props.questionData.answerObject.optionArray.map(item => ({text: item, state: "unselected"}));
        var optionSelected = randomise(optionSelected);
        var answerSelected = Array(targetSelected.length).fill(-1);

        var state =  {
            cssState: cssStates[cssStateIndex],
            currentLetterToFill: 0,
            answerSelected,
            targetSelected,
            optionSelected,
            answer: this.props.quizData.report[this.props.questionIndex] ? this.props.quizData.report[this.props.questionIndex].answer : null
        };
        return state;
    },

    componentWillMount: function() {
        cssStateIndex = 0;
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
        let duration = this.state.cssState.duration || 0;
        setTimeout(() => {
            this.handleCssState(cssStateIndex++);
        }, duration);
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
        //var numOptions = this.props.letters.length;
        var numOptions = this.state.targetSelected;
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
        //var numOptions = this.props.letters.length;
        var numOptions = this.props.questionData.answerObject.targetArray.length;
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

    calculateLinkPosition: function (targetIndex, optionIndex) {
        var containerWidth = 120;
        var optionSize = 60;
        var margin = 5;
        var width = 0, top = 0, left = 0, degree = 0, delta = 0;
        if (optionIndex >= 0) {
            top = ((targetIndex + optionIndex + 1) * optionSize + (targetIndex + optionIndex) * margin) / 2;
            delta = (optionIndex - targetIndex) * (optionSize + margin);
            width = Math.sqrt(delta*delta + containerWidth*containerWidth);
            degree = Math.atan(delta/containerWidth)*(180/Math.PI);
            left = containerWidth/2 - width/2;
        }
        return {width, top, left, degree};
    },

    handleSelect: function(type, index) {
        var targetSelected = this.state.targetSelected;
        var optionSelected = this.state.optionSelected;
        var answerSelected = this.state.answerSelected;
        var targetSelecting = targetSelected.map(function(item, index) {
            return {text: item.text, state: item.state, index};
        }).filter(function (item) {
            return item.state === "selecting";
        });
        var optionSelecting = optionSelected.map(function(item, index) {
            return {text: item.text, state: item.state, index};
        }).filter(function (item) {
            return item.state === "selecting";
        });

        if (type === 'target') {
            if (optionSelecting.length > 0) {
                answerSelected[index] = optionSelecting[0].index;
                optionSelected[optionSelecting[0].index].state = "selected";
                targetSelected[index].state = "selected";
            } else {
                if (targetSelecting.length > 0) {
                    targetSelected[targetSelecting[0].index].state = "unselected";
                }
                targetSelected[index].state = "selecting";
            }
        } else if (type === 'option') {
            if (targetSelecting.length > 0) {
                answerSelected[targetSelecting[0].index] = index;
                targetSelected[targetSelecting[0].index].state = "selected";
                optionSelected[index].state = "selected";
            } else {
                if (optionSelecting.length > 0) {
                    optionSelected[optionSelecting[0].index].state = "unselected";
                }
                optionSelected[index].state = "selecting";
            }
        }
        // All targets are linked, finish
        if (answerSelected.indexOf(-1) === -1) {
            var answer = answerSelected.map(function(option_index, target_index) { return targetSelected[target_index].text+'|'+optionSelected[option_index].text;}).join(":");
            this.props.onSelect(answer);
        }
        this.setState({
            targetSelected,
            optionSelected,
            answerSelected
        });
    },

    handleSelectTarget: function(index) {
        if (this.state.targetSelected[index].state === "selecting") {
            this.state.targetSelected[index].state = "unselected";
        }
        else if (this.state.targetSelected[index].state === "unselected") {
            this.handleSelect('target', index);
        }
    },

    handleSelectOption: function(index) {
        if (this.state.optionSelected[index].state === "selecting") {
            this.state.optionSelected[index].state = "unselected";
        }
        else if (this.state.optionSelected[index].state === "unselected") {
            this.handleSelect('option', index);
        }
    },


    handleDeleteLink: function(index){
        var answerSelected = this.state.answerSelected;
        var targetSelected = this.state.targetSelected;
        var optionSelected = this.state.optionSelected;
        targetSelected[index].state = "unselected";
        optionSelected[answerSelected[index]].state = "unselected";
        answerSelected[index] = -1;
        this.setState({
            answerSelected,
            targetSelected,
            optionSelected
        });
    },

    render: function() {
        var showAnswer, showTargets, showOptions, showCountdown;
        var unanswered = this.state.targetSelected.filter(function(item) {
            return item.state !== "selected";
        });
        if (cssStateIndex === 0) {
            return (<div className='ql-quiz-container' ref='main'>
                <div className="user-interaction" ref='userInteraction'></div>
            </div>);
        } else if (unanswered.length > 0) {
            var showTimer = this.props.currentQuiz.meta.showTimer == undefined ? true: this.props.currentQuiz.meta.showTimer == 1;
            showCountdown = <QLCountDown showCountdown={showTimer} startTime={this.props.startTime} duration={this.props.questionData.duration}/>;

            var showLinks = this.state.answerSelected.map(function(option_index, index){
                var {width, top, left, degree} = this.calculateLinkPosition(index, option_index);
                var hidden = option_index >= 0 ? "" : "hidden";
                return (
                    <div className={`link ${hidden}`}
                    style={{transform: 'rotate('+degree+'deg)', width: width+'px', top: top+'px', left: left+'px'}}
                    onClick={this.handleDeleteLink.bind(this, index)}>
                    </div>
                    );
            }, this);

            var self = this;
            var generateItems = function(items, handler) {
                return items.map(function(item, index){
                    var selected = item.state === "selected" ? "btn-normal.btn-selected": item.state === "selecting" ? "btn-selecting": "btn-danger";
                    return (
                        <div className={`option`}>
                            <button className={`letterTile ng-binding ng-scope option ${selected}`}
                            draggable="true"
                            onClick={handler.bind(this, index)}
                            key={index}>
                                <p className='title'>{item.text}</p>
                            </button>
                        </div>
                    );
                }, self);
            };
            var showTargets = generateItems(this.state.targetSelected, this.handleSelectTarget);
            var showOptions = generateItems(this.state.optionSelected, this.handleSelectOption);

            if (this.state.splitPoint) {
                showOptions.splice(this.state.splitPoint, 0, <br/>);
            }
            if (this.state.splitPointQuestion) {
                showTargets.splice(this.state.splitPointQuestion, 0, <br/>);
            }
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
            <div className='ql-quiz-container' ref='main' >
                <div className={`ql-question ql-linking ${this.state.cssState.name}`} onDragover={this.allowDrop}>
                    <h3 className='question'>
                        <QLQuestion
                            questionData={this.props.questionData}
                        />
                    </h3>

                    {this.props.questionData.imageURL ? <QLImage src={this.props.questionData.imageURL} className='ql-question-img'/> : null}
                    {showCountdown}
                    <div className="answers options">
                        {showAnswer}
                        <div className="user-interaction" ref='userInteraction'>
                            {!showAnswer ? <div>Link the items</div> : null}
                            <div className="linkingGroup">{showTargets}</div>
                            <div className="linkingGroup links">{showLinks}</div>
                            <div className="linkingGroup">{showOptions}</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = QLLinking;
