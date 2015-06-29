var React = require('react');
var router = require('createQuizApp/config/router');

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
