var React = require('react');
var latexString = require('createQuizApp/utils/LatexString');


var CQLatexString = React.createClass({
    propTypes: {
        children: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            children: ''
        };
    },
    render: function() {
        return (
            <span dangerouslySetInnerHTML={{__html: latexString(this.props.children)}}/>
        );
    }

});

module.exports = CQLatexString;
