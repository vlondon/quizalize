/* @flow */
import React from 'react';

import type {Question} from './../../../../../types';
import PQQuizStore from './../../../stores/PQQuizStore';
import PQLink from './../../utils/PQLink';
import PQPageTemplate from './../../PQPageTemplate';
import QLConversation, {startConversation} from './../../../../quizApp/components/QLConversation';
import QLMultiple from './../../../../quizApp/components/QLMultiple';
import QLVideoPlayer from './../../../../quizApp/components/QLVideoPlayer';

type State = {
    question?: Question;
}

class PQSplash extends React.Component {

    state: State;
    constructor(props: Object) {
        super(props);
        PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
        //c3c3880d-8981-4039-9f9f-b98149312c63
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        var quiz = PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
        if (quiz) {
             var question: Question = quiz.getQuestion(0);
            this.setState({
                quiz: quiz.toObject(),
                question: question.toObject()
            });
        }
    }

    componentWillMount() {
        PQQuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PQQuizStore.removeChangeListener(this.onChange);
    }

    _onSelect() {
        console.log('_onSelect !!! Working!');
    }

    _onNext() {
        console.log('_onNext !!! Not working yet!');
    }

    render() : any {
        var conversation = null;
        var multiple = null;

        if (this.state.quiz) {
            conversation = (
                <QLConversation quiz={this.state.quiz} />
            );

            multiple = (
                <QLMultiple
                    currentQuiz={this.state.quiz}
                    quizData={this.state.question}
                    question={this.state.question.question}
                    alternatives={this.state.question.alternatives}
                    questionData={this.state.question}
                    questionIndex={0}
                    startTime={Date.now()}
                    onSelect={this._onSelect.bind(this)}
                    onNext={this._onNext.bind(this)}
                />
            );
        }
        return (
            <PQPageTemplate>
                <h1>Splash</h1>
                <p>
                    <PQLink href='/play/class'>Log in as a student</PQLink>
                </p>

                {conversation}

                {multiple}

            </PQPageTemplate>
        );
    }
}

export default PQSplash;
