var React = require('react');

var QLMultiple = require('quizApp/components/QLMultiple');
var PQViewVideo = require('playQuizApp/components/views/PQViewVideo');

var QLVideoPlayer = React.createClass({

    propTypes: {
        question: React.PropTypes.string.isRequired,
        alternatives: React.PropTypes.array.isRequired,
        onSelect: React.PropTypes.func,
        onNext: React.PropTypes.func,
        quizData: React.PropTypes.object,
        questionData: React.PropTypes.object,
        currentQuiz: React.PropTypes.object,
        imageURL: React.PropTypes.string,
        latexEnabled: React.PropTypes.bool,
        imageEnabled: React.PropTypes.bool,
        startTime: React.PropTypes.number
    },

    getInitialState: function() {
        var questionIndex = this.props.currentQuiz.payload.questions.indexOf(this.props.questionData);
        var currentVideoSegmentIndex = questionIndex;
        var {start, end} = this.getStartEnd(questionIndex);
        console.log('start', start, end);
        if (start + 1 > end) {
            console.log('skipping!', start, end);
            currentVideoSegmentIndex = questionIndex + 1;
        }
        return {
            questionIndex,
            currentVideoSegmentIndex,
            startTime: this.props.startTime
        };
    },

    onNext: function(){

        console.log('onNext Clicked');
        var questionIndex = this.state.questionIndex + 1;
        console.log('questionIndex', questionIndex);
        this.setState({questionIndex}, ()=> {
            console.log('onNext??', this.state);
            this.props.onNext();
        });
    },

    getStartEnd: function(questionIndex, videoSegments){
        var start, end;
        questionIndex = questionIndex !== undefined ? questionIndex : this.state.questionIndex;
        videoSegments = videoSegments || this.props.videoQuiz.videoSegments;

        if (questionIndex === 0) {
            start = 0;
        } else {
            start = videoSegments[questionIndex - 1];
        }
        end = videoSegments[questionIndex];

        return {start, end};
    },

    componentWillReceiveProps: function(nextProps) {

    },

    componentDidMount: function() {

    },



    handleVideoComplete: function(){
        console.log('finished');
        this.setState({
            currentVideoSegmentIndex: this.state.questionIndex + 1,
            startTime: Date.now()
        });
    },

    render: function() {
        var {start, end} = this.getStartEnd();

        if (this.state.questionIndex === this.state.currentVideoSegmentIndex && start + 1 < end) {
            return (
                <PQViewVideo
                    start={start}
                    end={end}
                    onComplete={this.handleVideoComplete}
                />
            );
        } else {


            return (
                <QLMultiple
                    question={this.props.question}
                    alternatives={this.props.alternatives}
                    onSelect={this.props.onSelect}
                    onNext={this.onNext}
                    quizData={this.props.quizData}
                    questionData={this.props.questionData}
                    currentQuiz={this.props.currentQuiz}
                    imageURL={this.props.imageURL}
                    latexEnabled={this.props.latexEnabled}
                    imageEnabled={this.props.imageEnabled}
                    startTime={this.state.startTime}
                    videoQuiz={this.props.videoQuiz}
                />
            );
        }


    }

});

module.exports = QLVideoPlayer;
