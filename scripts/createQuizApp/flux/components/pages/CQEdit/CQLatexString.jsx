var React = require('react');
var latexString = require('createQuizApp/flux/utils/LatexString');


var CQLatexString = React.createClass({
    propTypes: {
        string: React.PropTypes.string
    },
    getDefaultProps: function() {
        return {
            string: ''
        };
    },
    render: function() {
        return (
            <div dangerouslySetInnerHTML={{__html: latexString(this.props.string)}}/>
        );
    }

});

module.exports = CQLatexString;
