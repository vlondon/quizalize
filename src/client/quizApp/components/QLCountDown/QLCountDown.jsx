var React = require('react');

var timeout;

var updateInterval = 100;
var startInterval = 60;
var buffer = 2;
var QLCountDown = React.createClass({

    propTypes: {
        showCountdown: React.PropTypes.bool,
        duration: React.PropTypes.number,
        startTime: React.PropTypes.number
    },

    getInitialState: function() {
        return {
            time: (this.props.duration || startInterval) + buffer,
            duration: (this.props.duration || startInterval) + buffer,
            startTime: (this.props.startTime || Date.now())
        };
    },

    componentDidMount: function() {
        timeout = setTimeout(this.handleTimeout, updateInterval);
    },
    componentWillUnmount: function() {
        clearTimeout(timeout);
    },


    handleTimeout: function(){
        var time = Math.floor(this.state.duration - (Date.now() - this.props.startTime) / 1000);
        time = (time > 0) ? time : 0;

        if (this.state.time !== time){
            this.setState({
                time,
                className: ''
            });
            setTimeout(()=> {

                this.setState({className: 'animated'});
            }, 50);
        }

        if (time > 0) {
            timeout = setTimeout(this.handleTimeout, updateInterval);
        }

    },

    render: function() {
        var timer;
        if (this.props.showCountdown) {
            timer = (
                <div className="countdown-number-holder">
                    <div className={`tick ${this.state.className}`}></div>
                    <div className="countdown-number">
                        {this.state.time}
                    </div>
                </div>
            );
        }
        return (
            <div className="ql-countdown">
                <div className="countdown-line">
                    {timer}
                </div>
            </div>
        );
    }

});

module.exports = QLCountDown;
