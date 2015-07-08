var React = require('react');
var router = require('createQuizApp/config/router');

var commandPressed = false;
/* window.addEventListener("keydown", function(ev){
    console.log("event", ev.keyCode);
}); */
var onKeyUp = function(ev){
    // cmd 91
    if ([93, 91, 17, 224].indexOf(ev.keyCode) !== -1 ){
        console.log("event", ev.keyCode);
        commandPressed = false;
    }

};
var onKeyDown = function(ev){
    // cmd 91
    if ([93, 91, 17, 224].indexOf(ev.keyCode) !== -1 ){
        console.log("event", ev.keyCode);
        commandPressed = true;
    }

};



var CQLink = React.createClass({

    propTypes: {
        children: React.PropTypes.any,
        href: React.PropTypes.string,
        className: React.PropTypes.string,
        stopPropagation: React.PropTypes.bool
    },

    getDefaultProps: function() {
        return {
            href: '',
            stopPropagation: false
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

        if (this.props.stopPropagation){
            ev.stopPropagation();
        }
        if (commandPressed === true){
            window.open(this.props.href);
        }
        else {

            router.setRoute(this.props.href);
        }
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
