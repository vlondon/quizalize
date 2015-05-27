var React = require('react');
var router = require('createQuizApp/flux/config/router');

var CQLink = React.createClass({

    propTypes: {
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element
        ]),
        href: React.PropTypes.string,
        className: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            href: ''
        };
    },

    handleClick: function(ev){
        ev.preventDefault();
        router.setRoute(this.props.href);
    },

    render: function(){
        return (
            <a onClick={this.handleClick} href={this.props.href} className={this.props.className}>
                {this.props.children}
            </a>
        );
    }
});

module.exports = CQLink;
