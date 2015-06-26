var React = require('react');
var router = require('createQuizApp/config/router');

var commandPressed = false;
/* window.addEventListener("keydown", function(ev){
    console.log("event", ev.keyCode);
}); */
var onKeyUp = function(ev){
    // cmd 91
    if (ev.keyCode === 91){
        console.log("event", ev.keyCode);
        commandPressed = false;
    }

};
var onKeyDown = function(ev){
    // cmd 91
    if (ev.keyCode === 91){
        console.log("event", ev.keyCode);
        commandPressed = true;
    }

};



var CQLink = React.createClass({

    propTypes: {
        children: React.PropTypes.any,
        href: React.PropTypes.string,
        className: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            href: ''
        };
    },

    componentDidMount: function() {
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

    },

    componentWillUnmount: function() {
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);

    },

    handleKeyDown: function(ev){
        console.log('ev', ev.keyCode);
    },

    handleKeyUp: function(ev){
        console.log('ev', ev.keyCode);
    },

    handleClick: function(ev){
        ev.preventDefault();
        if (commandPressed === true){
            window.open(this.props.href);
        }
         else

        router.setRoute(this.props.href);
    },

    render: function(){
        return (
            <a onClick={this.handleClick}
                href={this.props.href}
                className={this.props.className}>
                {this.props.children}
            </a>
        );
    }
});

module.exports = CQLink;
