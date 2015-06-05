var React = require('react');
var router = require('createQuizApp/config/router');

var CQLink = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ]),
        href: React.PropTypes.string,
        className: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            href: ''
        };
    },

    handleKeyDown: function(ev){
        console.log('ev', ev.keyCode);
    },

    handleKeyUp: function(ev){
        console.log('ev', ev.keyCode);
    },

    handleClick: function(ev){
        ev.preventDefault();
        router.setRoute(this.props.href);
    },

    render: function(){
        return (
            <a onClick={this.handleClick}
                href={this.props.href}
                onKeyDown={this.handleKeyDown}
                onKeyUp={this.handleKeyUp}
                className={this.props.className}>
                {this.props.children}
            </a>
        );
    }
});

module.exports = CQLink;
