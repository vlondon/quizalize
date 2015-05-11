var React = require('react');


var toSeconds = function(ms){
    return Math.round(ms / 10) / 100 + 's';
};
var Star = React.createClass({

    getInitialState: function() {
        return {
            rotation: Math.random() * 360,
            scale: Math.random() + 0.5,
            delay: parseInt(Math.random() * 1000, 10) + 1000
        };
    },

    cssStyle: function(){

        var rotate = this.state.rotation;
        var scale = this.state.scale;


        var newCss = {
            WebkitTransform: `rotate(${rotate}deg) scale(${scale})`,
            MsTransform: `rotate(${rotate}deg) scale(${scale})`
        };
        return newCss;
    },

    cssDelay: function(){
        var animationDelay = this.state.delay;
        var newCss = {
            WebkitAnimationDelay: `${animationDelay}ms`,
            animationDelay: `${animationDelay}ms`
        };
        return newCss;
    },

    render: function() {
        return (
            <div style={this.cssStyle()} className='star-transform'>
                <img style={this.cssDelay()} src='/img/ui-quiz/star.svg' width='40' height='40' className='star-animated'/>
            </div>
        );
    }

});


var QLAnswerScreen = React.createClass({

    propTypes: {
        answerData: React.PropTypes.object.isRequired,
        onNext: React.PropTypes.func
    },

    handleClick: function(){
        if (this.props.onNext){
            this.props.onNext();
        }
    },

    render: function() {
        var stars = [];
        for (var i = 0; i < 30; i++){
            stars.push(<Star key={i}/>);
        }

        return (
            <div className='ql-answer-screen'>
                <div className="star-container">
                    {stars}
                </div>
                <h4 className="text-1">
                    Your answer
                </h4>
                <div className="alternatives">
                        <div className="alternative-wrapper">
                            <button type="button" className={`btn answer answer-correct`}>
                                {this.props.answerData.answer}
                            </button>
                        </div>
                </div>
                <h4 className="text-2">
                    is correct!
                </h4>

                <div className="score-and-time">
                    <h3 className="score">
                        <div>Your score</div>
                        <strong>
                            {this.props.answerData.roundedScore}
                        </strong>
                    </h3>
                    <h3 className="time">
                        <div>Your time</div>
                        <strong>
                            {toSeconds(this.props.answerData.duration)}
                        </strong>
                    </h3>
                    <span className="next-anim">
                        <h3 className="next" onClick={this.handleClick}>
                            <div>
                                Next
                            </div>
                            <strong>
                                <img src="/img/ui-quiz/arrow-right.svg" width="102" height="80"/>
                            </strong>
                        </h3>
                    </span>
                </div>
            </div>
        );
    }

});

module.exports = QLAnswerScreen;
