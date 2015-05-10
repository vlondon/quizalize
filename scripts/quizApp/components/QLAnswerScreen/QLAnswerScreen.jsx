var React = require('react');

var Star = React.createClass({
    getInitialState: function() {
        return {
            rotation: Math.random() * 360,
            scale: Math.random() + 0.5,
            delay: parseInt(Math.random() * 1000, 10)
        };
    },
    componentDidMount: function() {

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
        answer: React.PropTypes.string.isRequired
    },

    render: function() {
        var stars = [];
        for (var i = 0; i < 10; i++){
            stars.push(<Star key={i}/>);
        }

        return (
            <div className='ql-answer-screen'>
                Your answer is
                <div className="alternatives">
                        <div className="alternative-wrapper">
                            <button type="button" className={`btn answer answer-correct`}>
                                {this.props.answer}
                            </button>
                        </div>
                </div>
                Correct!
                <div className="star-container">
                    {stars}
                </div>
            </div>
        );
    }

});

module.exports = QLAnswerScreen;
