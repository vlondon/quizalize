var React = require('react');

var QLMultiple = require('quizApp/components/QLMultiple');
var QLFreetext = require('quizApp/components/QLFreetext');
var QLScrambled = require('quizApp/components/QLScrambled');
var QLBoolean = require('quizApp/components/QLBoolean');
var QLSorting = require('quizApp/components/QLSorting');
var QLLinking = require('quizApp/components/QLLinking');
var PQViewVideo = require('playQuizApp/components/views/PQViewVideo');

var QLVideoPlayer = React.createClass({

    propTypes: {
        onSelect: React.PropTypes.func,
        onNext: React.PropTypes.func,
        currentQuiz: React.PropTypes.object,
        questionData: React.PropTypes.object,
        startTime: React.PropTypes.number
    },

    getStateForProps(props: Object): Object {
        var videoOpen = false;
        if (props.questionData.questionObject.type === "videoq") {
            videoOpen = (props.questionData.questionObject.autoPlay === 1);
        }
        return {
            videoOpen,
            videoComplete: false,
            startTime: props.startTime
        };
    },

    getInitialState: function() {
        return this.getStateForProps(this.props);
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

    componentWillReceiveProps: function(nextProps: Object) {
        if (this.props.questionData !== nextProps.questionData) {
            this.setState(this.getStateForProps(nextProps));
        }
    },

    componentDidMount: function() {

    },

    handleVideoAnswer: function(){
        console.log('show video');
        this.setState({
            videoOpen: true
        });
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
            if (this.state.videoOpen === true) {
                return (
                    <PQViewVideo
                        video={this.props.questionData.questionObject.url}
                        start={start}
                        end={end}
                        onComplete={this.handleVideoComplete}
                    />
                );
            }
            else {
                return (
                    <div className="view-video">
                        <img className="video-icon" src="/img/ui-quiz/youtube-player.png" alt="" onClick={this.handleVideoAnswer}/>
                    </div>
                );
            }
        } else {
            console.log('this.state.startTime => ', this.state.startTime);
            props.startTime = this.state.startTime;
            props.questionIndex = this.state.questionIndex;
            switch (this.props.questionData.answerObject.type) {
              case "multiple":
                return (
                    <QLMultiple {...props} />
                );
                break;
              case "scrambled":
                return (
                    <QLScrambled {...props} />
                );
                break;
              case "freetext":
                return (
                    <QLFreetext {...props} />
                );
                break;
              case "boolean":
                return (
                    <QLBoolean {...props} />
                );
                break;
              case "sorting":
                return (
                    <QLSorting {...props} />
                );
                break;
              case "linking":
                return (
                    <QLLinking {...props} />
                );
                break;
              default:
            }
        }
    }
});

module.exports = QLVideoPlayer;
