var React = require('react');

var QLLatex = require('quizApp/components/QLLatex');



var QLQuestion = React.createClass({

    propTypes: {
        questionData: React.PropTypes.object.isRequired,
        attributes: React.PropTypes.object.isRequired
    },
    getInitialState: function() {
        return {};
    },

    latexWrapper: function(string) {
        if (this.props.questionData.latexEnabled) {
            return (<QLLatex>{string}</QLLatex>);
        } else {
            return (<span>{string}</span>);
        }
    },

    render: function() {
        var questionText;
        if (this.props.questionData.questionObject.type == "audio") {
            questionText = (
                <audio controls="true" autoPlay>
                    <source src={this.props.questionData.questionObject.url} type="audio/mpeg"/>
                    Your browser does not support the audio element.
                </audio>);
        }
        else {
            questionText = this.props.questionData.questionObject.text;
        }
        return (
            <p className='question'>
                {this.latexWrapper(questionText)}
            </p>
        );
    }

});

module.exports = QLQuestion;
