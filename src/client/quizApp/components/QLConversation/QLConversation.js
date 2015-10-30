import React, { PropTypes } from 'react';

import CQConversationBubble from './components/CQConversationBubble/CQConversationBubble';

class QLConversation extends React.Component {

    static propTypes = {
        quiz: PropTypes.object
    };

    constructor(props) {
        super(props);

        let { quiz } = this.props;
        let { questions } = quiz.payload;
        let userSentences = [];
        let sentences = questions
            .map(q=>q.question.split('|'));

        sentences = sentences.map((s, oi)=>{
            return s.map((si, i) => {

                if (i + 1 === s.length) {
                    return {
                        type: 'question',
                        value: si,
                        question: questions[oi]
                    };
                } else {
                    return {
                        type: 'sentence',
                        value: si
                    };
                    console.log('sentence');
                }
            });
        }).reduce((a, b)=> a.concat(b));

        console.log('sentences', sentences);

        let maxSteps = sentences.length;
        this.state = {
            maxSteps,
            sentences,
            currentStep: 0,
            timeBetweensteps: 1500,
        };

        this.calculateStep = this.calculateStep.bind(this);

        setTimeout(this.calculateStep, this.state.timeBetweensteps);

    }

    calculateStep(){

        let {currentStep, maxSteps, timeBetweensteps, sentences} = this.state;

        currentStep++;

        let nextContent = sentences[currentStep - 1];
        nextContent.date = Date.now();
        this.setState({currentStep, sentences});

        if (currentStep < maxSteps && nextContent.type === 'sentence') {
            setTimeout(this.calculateStep, timeBetweensteps);
        }
    }

    handleAnswer (answer) {
        console.log('answer', answer);
    }


    render () {

        let { sentences } = this.state;

        let quizalizeBubbles = [];
        let userBubles = [];

        for (var i = 0; i < this.state.currentStep; i++) {
            quizalizeBubbles.push(<CQConversationBubble key={`entry-${i}`}entry={sentences[i]} onAnswer={this.handleAnswer}/>);
        }

        return (
            <div className="conversation">
                {quizalizeBubbles}
            </div>
        );
    }
}

export default QLConversation;
