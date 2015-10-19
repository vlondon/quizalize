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
        var input = this.props.children;
        if (input.indexOf("videoq:") === 0) {
            var index = input.indexOf("//");
            if (index !== -1) {
                input = input.substring(index+2);
            }
        }
        return (
            <span dangerouslySetInnerHTML={{__html: latexString(input)}}/>
        );
    }

});

module.exports = CQLatexString;
