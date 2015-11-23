var React = require('react');
var QLLatex = require('./../../components/QLLatex');
var PQViewVideo = require('./../../../playQuizApp/components/views/PQViewVideo');

var toSeconds = function(ms){
    return Math.round(ms / 10) / 100 + 's';
};

var Star = React.createClass({

    getInitialState: function() {
        return {
            rotation: Math.random() * 360,
            scale: Math.random() + 0.5,
            delay: Math.random() * 1000 + 1000
        };
    },

    cssStyle: function(){

        var rotate = this.state.rotation;
        var scale = this.state.scale;


        var newCss = {
            WebkitTransform: `rotate(${rotate}deg) scale(${scale})`,
            MozTransform: `rotate(${rotate}deg) scale(${scale})`,
            msTransform: `rotate(${rotate}deg) scale(${scale})`,
            transform: `rotate(${rotate}deg) scale(${scale})`
        };
        return newCss;
    },

    cssDelay: function(){
        var animationDelay = this.state.delay;
        var newCss = {
            WebkitAnimationDelay: `${animationDelay}ms`,
            animationDelay: `${animationDelay}ms`
        };
        return newCss;
    },

    render: function(): any {
        return (
            <div style={this.cssStyle()} className='star-transform'>
                <img style={this.cssDelay()} src='/img/ui-quiz/star.svg' width='40' height='40' className='star-animated'/>
            </div>
        );
    }

});

var QLAnswerScreen = React.createClass({

    propTypes: {
        currentQuiz: React.PropTypes.object,
        answerData: React.PropTypes.object.isRequired,
        questionData: React.PropTypes.object.isRequired,
        onNext: React.PropTypes.func
    },

    getInitialState: function() {
        return {};
    },

    componentDidMount: function() {
        if (this.props.currentQuiz && this.props.currentQuiz.meta && this.props.currentQuiz.meta.showResult === "0" && this.props.onNext){
            this.props.onNext();
        }
    },

    handleClick: function() {
        if (this.props.onNext){
            this.props.onNext();
        }
    },

    handleVideoAnswer: function() {
        console.log('should answer video');
        this.setState({
            videoOpen: true
        });
    },

    handleVideoComplete: function() {
        console.log('video is finished');
        this.setState({videoOpen: false});
    },

    render: function(): any {
        var stars = [];
        var correctAnswer, viewVideo, videoPlayer, explanation;
        var hasPartialScore = 0 < this.props.answerData.partial && this.props.answerData.partial < 1;
        var questionType = this.props.questionData.answerObject ? this.props.questionData.answerObject.type : "";
        var answer = this.props.answerData.answer;
        var response = this.props.answerData.response;


        if (this.props.answerData.correct){
            for (var i = 0; i < 30; i++){
                stars.push(<Star key={i}/>);
            }
        }

        // If in showResult == 0 mode, skip rendering the answerscreen
        if (this.props.currentQuiz && this.props.currentQuiz.meta && this.props.currentQuiz.meta.showResult === "0" && this.props.onNext){
            return (<div></div>);
        }


        if (questionType === "sorting" || questionType === "linking") {
            function formatAnswer (ans) {
                return ans.split(":").map(function (group) {
                    var meta = group.split("|");
                    return (
                        <div className={`answer-item ${questionType}`}>
                            <QLLatex>{meta[0]}</QLLatex>
                            <div className="group-item">
                                <QLLatex>{meta[1]}</QLLatex>
                            </div>
                        </div>
                    );
                });
            }
            answer = formatAnswer(answer);
            response = formatAnswer(response);
        }
        else {
            answer = (<QLLatex>{answer}</QLLatex>);
            response = (<QLLatex>{response}</QLLatex>);
        }

        if ((!this.props.answerData.correct || hasPartialScore) && (this.props.currentQuiz && (this.props.currentQuiz.meta.showAnswers === undefined || this.props.currentQuiz.meta.showAnswers==1))){
            correctAnswer = (
                <div className="text-2">
                    {hasPartialScore ? 'To get maximum point, the answer is' : 'The correct answer is'}
                    <div className="alternatives">
                        <div className="alternative-wrapper">
                            <button type="button" className={`btn answer answer-correct`}>
                                {answer}
                            </button>
                        </div>
                    </div>
                </div>
            );
        }


        if (this.props.questionData.expObject) {
            if (!this.props.answerData.correct || this.props.questionData.expObject.show === 1) {
                if (this.props.questionData.expObject.type === "videoq" && this.props.questionData.expObject.start && this.props.questionData.expObject.end) {
                    if (this.props.questionData.expObject.autoPlay === 0) {
                        viewVideo = (
                            <div className="view-video">
                                <img src="/img/ui-quiz/youtube-player.png" alt="" onClick={this.handleVideoAnswer}/>
                            </div>
                        );
                    }
                }

                if (this.state.videoOpen === true || this.props.questionData.expObject.autoPlay === 1){
                    var start = this.props.questionData.expObject.start;
                    var end = this.props.questionData.expObject.end;
                    videoPlayer = (
                        <PQViewVideo
                            video={this.props.questionData.expObject.url}
                            start={start}
                            end={end}
                            onComplete={this.handleVideoComplete}
                        />
                    );
                }
                explanation = (<blockquote className="description">
                    <p>
                        {this.props.questionData.expObject.text}
                    </p>
                </blockquote>);
            }
        }

        return (
            <div>
                {videoPlayer}
                <div className='ql-answer-screen'>
                    <div className="star-container">
                        {stars}
                    </div>
                    <div className="text-1">

                        <h4>
                            <span>Your answer </span>
                            {this.props.answerData.correct ? 'is correct!' : 'is wrong'}
                        </h4>
                        <div className="alternatives">
                                <div className="alternative-wrapper">
                                    <button type="button" className={this.props.answerData.correct ? `btn answer answer-correct` : 'btn answer answer-wrong'}>
                                        {response}
                                    </button>
                                </div>
                        </div>
                    </div>

                    {correctAnswer}
                    {viewVideo}
                    {explanation}


                    <div className="score-and-time">
                        <h3 className="score">
                            <div>Your score</div>
                            <strong>
                                {this.props.answerData.roundedScore}
                            </strong>
                        </h3>
                        <h3 className="time">
                            <div>Your time</div>
                            <strong>
                                {toSeconds(this.props.answerData.duration)}
                            </strong>
                        </h3>
                        <span className="next-anim">
                            <h3 className="next" onClick={this.handleClick}>
                                <div>
                                    Next
                                </div>
                                <strong>
                                    <img src="/img/ui-quiz/arrow-right.svg" />
                                </strong>
                            </h3>
                        </span>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLAnswerScreen;
