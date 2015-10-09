var React = require('react');

var QLMultiple = require('quizApp/components/QLMultiple');
var QLFreetext = require('quizApp/components/QLFreetext');
var QLScrambled = require('quizApp/components/QLScrambled');
var PQViewVideo = require('playQuizApp/components/views/PQViewVideo');

var QLVideoPlayer = React.createClass({

    propTypes: {
        onSelect: React.PropTypes.func,
        onNext: React.PropTypes.func,
        currentQuiz: React.PropTypes.object,
        questionData: React.PropTypes.object,
        currentQuiz: React.PropTypes.object,
        startTime: React.PropTypes.number
    },

    getInitialState: function() {
        return {
            videoComplete: false,
            startTime: this.props.startTime
        };
    },

    onNext: function(){
        this.props.onNext();
    },

    getStartEnd: function(){
        var start, end;
        if (this.props.questionData.questionObject.type === "videoq") {
            start = parseInt(this.props.questionData.questionObject.start);
            end = parseInt(this.props.questionData.questionObject.end);
        }
        return {start, end};
    },

    componentWillReceiveProps: function() {

    },

    componentDidMount: function() {

    },



    handleVideoComplete: function(){
        console.log('finished');
        this.setState({
            videoComplete: true,
            startTime: Date.now()
        });
    },

    render: function() {
        var {start, end} = this.getStartEnd();
        var props = Object.assign({},this.props);
        if (!this.state.videoComplete && this.props.questionData.questionObject.type === "videoq" && start!==undefined && end!==undefined) {
            return (
                <PQViewVideo
                    video={this.props.questionData.questionObject.url}
                    start={start}
                    end={end}
                    onComplete={this.handleVideoComplete}
                />
            );
        } else {
            props.startTime = this.state.startTime;
            props.questionIndex = this.state.questionIndex;
            if (this.props.questionData.answerObject.type === "multiple"){
                return (
                    <QLMultiple
                        {...props}
                    />
                );
            } else if (this.props.questionData.answerObject.type === "scrambled"){
                return (
                    <QLScrambled
                        {...props}
                    />
                );
            } else if (this.props.questionData.answerObject.type === "freetext"){
                return (
                    <QLFreetext
                        {...props}
                    />
                );
            }
        }
    }
});

module.exports = QLVideoPlayer;
