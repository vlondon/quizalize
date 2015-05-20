var React = require('react');
var TeX = require('react-components/js/tex.jsx');

var QLLatex = React.createClass({

    propTypes: {
        children: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        var doubleDollar = /\$\$[\s\S]+?\$\$/g;
        var singleDollar = /\$[\s\S]+?\$/g;
        var content = this.props.children;


        var hasDoubleDollar = doubleDollar.test(this.props.children);
        var hasSingleDollar = singleDollar.test(this.props.children);

        if (hasDoubleDollar){
            content = this.props.children.slice(2, -2);
        } else if (hasSingleDollar){
            content = this.props.children.sclie(1, -1);
        }

        return {
            isLatex: hasDoubleDollar || hasSingleDollar,
            content
        };
    },

    render: function() {

        if (this.state.isLatex) {
            return (<TeX>{this.state.content}</TeX>);
        } else {
            return (
                <div>{this.state.content}</div>
            );

        }
    }

});

module.exports = QLLatex;
