var React = require('react');

var timeout, startTimer;

var updateInterval = 100;
var startInterval = 62;
var CountDown = React.createClass({

    getInitialState: function() {
        return {
            time: startInterval
        };
    },

    componentDidMount: function() {
        startTimer = Date.now();
        timeout = setTimeout(this.handleTimeout, updateInterval);
    },
    componentWillUnmount: function() {
        clearTimeout(timeout);
    },


    handleTimeout: function(){
        var time = Math.floor(startInterval - (Date.now() - startTimer) / 1000);

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
        return (
            <div className="ql-countdown">
                <div className="countdown-line">
                    <div className="countdown-number-holder">
                        <div className={`tick ${this.state.className}`}></div>
                        <div className="countdown-number">
                            {this.state.time}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CountDown;
