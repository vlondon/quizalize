/* @flow */
import React from 'react';

import type {Question} from './../../../../../types';
import PQQuizStore from './../../../stores/PQQuizStore';
import PQQuizActions from './../../../actions/PQQuizActions';
import PQPageTemplate from './../../PQPageTemplate';
import QLVideoPlayer from './../../../../quizApp/components/QLVideoPlayer';

type State = {
    question?: Question;
}

var quizId = '7f397534-fb8c-4c1e-8d72-f0a4c95774ae'; // 9b8f788f-7889-488e-ba33-a82c56f04c47

class PQQuiz extends React.Component {

    state: State;
    constructor(props: Object) {
        super(props);
        PQQuizStore.getQuiz(quizId);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        var quiz = PQQuizStore.getQuiz(quizId);
        if (quiz) {
            var question: Question = quiz.getCurrentQuestion();
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

    _onSelect(userAnswer) {
        console.log('User answer: ', this.state.quiz, this.state.question);
        PQQuizActions.answerQuestion(
            this.state.quiz.uuid,
            this.state.question,
            userAnswer,
            5000 // TODO: Math.max(new Date().getTime() - startTime - 2000, 0)
        );
    }

    _onNext() {
        var quiz = PQQuizStore.getQuiz(quizId);
        var question: Question = quiz.getNextQuestion();
        this.setState({
            question: question.toObject()
        });
    }

    render() : any {

        var player = null;
        if (this.state.quiz) {
            let quiz = PQQuizStore.getQuiz(quizId);
            player = (
                <QLVideoPlayer
                    currentQuiz={this.state.quiz}
                    quizData={this.state.quiz}
                    questionData={this.state.question}
                    questionIndex={quiz.questionIndex}
                    startTime={Date.now()}
                    onSelect={this._onSelect.bind(this)}
                    onNext={this._onNext.bind(this)}
                />
            );
        }

        return (
            <PQPageTemplate>
                <h1>Play</h1>

                { player }

            </PQPageTemplate>
        );
    }
}

export default PQQuiz;
