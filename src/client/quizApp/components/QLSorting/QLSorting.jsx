var React = require('react');

var randomise = require('quizApp/utils/randomise');
var QLQuestion = require('quizApp/components/QLQuestion');
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

var QLSorting = React.createClass({

    propTypes: {
        currentQuiz: React.PropTypes.object.isRequired,
        quizData: React.PropTypes.object.isRequired,
        questionData: React.PropTypes.object.isRequired,
        startTime: React.PropTypes.number.isRequired,
        onSelect: React.PropTypes.func.isRequired,
        onNext: React.PropTypes.func.isRequired,
        questionIndex: React.PropTypes.func.number
    },

    getInitialState: function() {
        var letters = [], answerSelected = [];
        this.props.questionData.answerObject.sortingArray.map(function (group) {
            var meta = group.split("|");
            answerSelected.push({name: meta[0], items:[]});
            letters = letters.concat(meta[1].split(","));
        });
        var letters = randomise(letters);
        var letterSelected = letters.map(function(letter) {
            return {text:letter, state:"unselected"};
        });
        var state =  {
            cssState: cssStates[cssStateIndex],
            currentLetterToFill: 0,
            answerSelected,
            letterSelected,
            answer: this.props.quizData.report[this.props.questionIndex] ? this.props.quizData.report[this.props.questionIndex].answer : null
        };
        return state;
    },

    componentWillMount: function() {
        cssStateIndex = 0;
    },

    componentDidMount: function() {
        window.addEventListener('resize', this.handleResize);
        _domElement = this.refs.main.getDOMNode();
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
        //var numOptions = this.props.letters.length;
        var numOptions = this.state.lettersSelected;
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
        var numOptions = this.props.questionData.answerObject.sortingArray.length;
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

    handleSelectLetter: function(index){
        var letterSelected = this.state.letterSelected;
        if (letterSelected[index].state === 'unselected') {
            letterSelected[index].state = 'selecting';
        }
        else if (letterSelected[index].state === 'selecting') {
            letterSelected[index].state = 'unselected';
        }
        this.setState({
            letterSelected,
        });
    },

    handleAddToGroup: function(index){
        var letterSelected = this.state.letterSelected;
        var answerSelected = this.state.answerSelected;
        var selecting = this.state.letterSelected.map(function(letter, index) {
            return {text: letter.text, state: letter.state, index};
        }).filter(function (letter) {
            return letter.state === "selecting";
        });

        letterSelected = letterSelected.map(function(letter) {
            if (letter.state === "selecting") {
                return {text:letter.text, state:"selected"};
            }
            else {
                return letter;
            }
        });

        answerSelected[index].items = answerSelected[index].items.concat(selecting);
        // Finish
        var unanswered = this.state.letterSelected.filter(function(letter) {
            return letter.state === "unselected";
        });
        if (unanswered.length == 0) {
            var answer = answerSelected.map(function(group) { return group.name+"|"+group.items.map(function(letter){ return letter.text; }).sort().join(","); }).join(":");
            this.props.onSelect(answer);
        }
        this.setState({
            letterSelected,
            answerSelected
        });
    },

    handleRemoveFromGroup: function(group_index, index){
        var answerSelected = this.state.answerSelected;
        var letterSelected = this.state.letterSelected;
        var itemToRemove = answerSelected[group_index].items.splice(index, 1);
        letterSelected[itemToRemove[0].index].state = "unselected";

        this.setState({
            letterSelected,
            answerSelected
        });
    },

    render: function() {
        var showAnswer, showTargets, showOptions, showCountdown;
        var unanswered = this.state.letterSelected.filter(function(letter) {
            return letter.state !== "selected";
        });
        var width = 100;
        var maxLength = 0;
        //determine biggest element length
        this.state.letterSelected.forEach(function(item) {
            if (maxLength < ("" + item).length) {
                maxLength = ("" + item).length;
            }
        });
        width = 50 + (maxLength * 20);
        if (cssStateIndex === 0) {
            return (<div className='ql-quiz-container' ref='main'></div>);
        } else if (unanswered.length > 0) {
            var that = this;
            var showTimer = this.props.currentQuiz.meta.showTimer == undefined ? true: this.props.currentQuiz.meta.showTimer == 1;
            showCountdown = <QLCountDown showCountdown={showTimer} startTime={this.props.startTime} duration={this.props.questionData.duration}/>;
            showTargets = this.state.answerSelected.map(function(group, group_index){
                var letters = group.items.map(function(letter, index) {
                    var selected = letter.index === -1 ? "btn-info": "btn-danger";
                    return (
                        <button className={`letterTile ng-binding ng-scope solution ${selected}`}
                            style={{width: width - 10 + 'px'}}
                            onClick={that.handleRemoveFromGroup.bind(that, group_index, index)}
                            key={index}>
                            {letter.text}
                        </button>
                    );
                });
                return (
                    <div className={`sortingGroup`} style={{width: width + 'px'}}
                    onDragover={that.allowDrop}
                    onDrop={that.handleDrop}>
                        <button className={`ng-binding ng-scope group`}
                        style={{width: width - 10 + 'px'}}
                        onClick={that.handleAddToGroup.bind(that, group_index)}
                        key={group_index}>
                            <p className='groupTitle'>{group.name}</p>
                        </button>
                        {letters}
                    </div>
                );
            }, this);

            showOptions = this.state.letterSelected.map(function(letter, index){
                if (true) {
                    var selected = letter.state === "selected" ? "btn-normal.btn-selected": letter.state === "selecting" ? "btn-selecting": "btn-danger";
                    return (
                        <button className={`letterTile ng-binding ng-scope option ${selected}`}
                            style={{width: width + 'px'}}
                            draggable="true"
                            onDragStart={this.handleSelectLetter.bind(this, index)}
                            onClick={this.handleSelectLetter.bind(this, index)}
                            key={index}>
                            {letter.state === 'selected' ? "_": letter.text}
                        </button>
                    );
                }
            }, this);

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
                <div className={`ql-question ql-sorting ${this.state.cssState.name}`} onDragover={this.allowDrop}>
                    <h3 className='question'>
                        <QLQuestion
                            questionData={this.props.questionData}
                        />
                    </h3>

                    {this.props.questionData.imageURL ? <QLImage src={this.props.questionData.imageURL} className='ql-question-img'/> : null}
                    {showCountdown}
                    <div className="answers options">
                        {showAnswer}
                        <div>
                            {showTargets}
                        </div>
                        <div className="user-interaction" ref='userInteraction'>
                            {!showAnswer ? <div>Secect the answers below and place them in correct buckets</div> : null}
                            {showOptions}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLSorting;
