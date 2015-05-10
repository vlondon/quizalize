var React = require('react');

var QLAnswerScreen = require('quizApp/components/QLAnswerScreen');

var cssStates = [
    {
        name: 'enter',
        duration: 1000
    },
    {
        name: ''
    },
    {
        name: 'exit'
    }
];

var cssStateIndex = 0;

var QLMultiple = React.createClass({

    propTypes: {
        question: React.PropTypes.string.isRequired,
        alternatives: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            cssState: cssStates[cssStateIndex],
            answered: null
        };
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
                    this.handleCssState(newCssStateIndex + 1);
                }, newCssState.duration);
            }
        }
    },

    handleClick: function(index){
        console.log('button clicked', index);

        this.setState({
            answer: this.props.alternatives[index]
        });

        this.handleCssState(2, () => {
            console.log('new state finished!');
        });

        // if (this.props.onSelect) {
        //     this.props.onSelect(index);
        // }
    },

    render: function() {

        var showAnswer = this.state.answer ? <QLAnswerScreen answer={this.state.answer}/> : null;
        return (
            <div className='ql-quiz-container'>
                <div className={`ql-question ql-multiple ${this.state.cssState.name}`}>
                    <h3 className='question'>
                        {this.props.question}
                    </h3>
                    <div className="answers alternatives">

                        {showAnswer}
                        {this.props.alternatives.map(function(alternative, index){
                            return (
                            <div className="alternative-wrapper">
                                <button type="button" className={`btn alternative alternative-${index}`} onClick={this.handleClick.bind(this, index)}>
                                    {alternative}
                                </button>
                            </div>);
                        }, this)}
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLMultiple;
