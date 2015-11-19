/* @flow */
import React from 'react';

import type, { Question } from './../../../../../types';

//import urlParams from './../../../../createQuizApp/utils/urlParams';

import PQQuizStore from './../../../stores/PQQuizStore';
import PQQuizActions from './../../../actions/PQQuizActions';

import PQPageTemplate from './../../PQPageTemplate';
import PQFeedback from './../PQFeedback';

import QLVideoPlayer from './../../../../quizApp/components/QLVideoPlayer';

type State = {
    question?: Question;
}

//var params = urlParams();
//var quizId = params.quizId;

class PQQuiz extends React.Component {

    state: State;
    constructor(props: Object) {
        super(props);
        PQQuizStore.getQuiz(props.quizId);
        this.state = {};
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        var quiz = PQQuizStore.getQuiz(this.props.quizId);
        if (quiz) {
            var question: Question = quiz.getCurrentQuestion();
            this.setState({
                quiz: quiz.toObject(),
                question: question.toObject(),
                completed: false
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
        var quiz = PQQuizStore.getQuiz(this.props.quizId);
        if (quiz.questionIndex + 1 === this.state.quiz.questionCount) {
            this.setState({
                completed: true
            });
        } else {
            var question: Question = quiz.getNextQuestion();
            this.setState({
                question: question.toObject()
            });
        }
    }

    render() : any {

        var content = null;
        if (this.state.quiz) {
            if (this.state.completed) {
                // Feedback
                content = (
                    <div>
                        <h1>Feedback</h1>
                        <PQFeedback quizId={this.props.quizId} />
                    </div>
                );
            } else {
                // Quiz
                let quiz = PQQuizStore.getQuiz(this.props.quizId);
                content = (
                    <div>
                        <h1>Play</h1>
                        <QLVideoPlayer
                            currentQuiz={this.state.quiz}
                            quizData={this.state.quiz}
                            questionData={this.state.question}
                            questionIndex={quiz.questionIndex}
                            startTime={Date.now()}
                            onSelect={this._onSelect.bind(this)}
                            onNext={this._onNext.bind(this)}
                        />
                    </div>
                );
            }
        }

        return (
            <PQPageTemplate>

                { content }

            </PQPageTemplate>
        );
    }
}

export default PQQuiz;
