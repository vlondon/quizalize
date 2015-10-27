/* @flow */
import React from 'react';

import PQViewVideo from './../../views/PQViewVideo';

import QLMultiple from './../../../../quizApp/components/QLMultiple';



type Props = {
    quiz: Object
}

export default class PQVideoMultiple extends React.Component {

    constructor(props:Props){
        super(props);
        var quizObject = props.quiz.toObject();
        var videoSegments: Array<string> = quizObject.meta.name.split('|');
        videoSegments.shift();
        // videoSegments.unshift('0:00');
        this.state = {
            isAnswering: false,
            currentSegment: 0,
            currentQuestionIndex: 0,
            quiz: quizObject,
            question: quizObject.payload.questions[0],
            videoSegments
        };

        this.handleVideoComplete = this.handleVideoComplete.bind(this);
    }

    handleVideoComplete(){
        console.log('video is complete');
        this.setState({isAnswering: true});
    }

    render (): any {

        var name = this.state.quiz.meta.name.split('|')[0];
        var videoPlayer, question;

        if (!this.state.isAnswering){
            var start, end;

            if (this.state.currentSegment === 0) {
                start = '0:00';
            } else {
                start = this.state.videoSegments[this.state.currentSegment - 1];
            }

            end = this.state.videoSegments[this.state.currentSegment];
            videoPlayer = (<PQViewVideo
                                start={start}
                                end={end}
                                onComplete={this.handleVideoComplete}
                            />);
        } else {
            question = (
                <QLMultiple
                    question={this.state.question.question}
                    alternatives={this.state.question.alternatives}
                    questionData={this.state.question}
                />
        );
        }

        return (
            <h1>
                {name}
                {videoPlayer}
                {question}
            </h1>
        );
    }
}
PQVideoMultiple.propTypes = {
    quiz: React.PropTypes.Object
};
