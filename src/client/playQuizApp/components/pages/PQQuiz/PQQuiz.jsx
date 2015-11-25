/* @flow */
import React from 'react';

import type { Question } from './../../../../../types';

//import urlParams from './../../../../createQuizApp/utils/urlParams';

import PQQuizClass from './../../../stores/extra/PQQuizClass';
import PQQuestionClass from './../../../stores/extra/PQQuestionClass';

import PQQuizStore from './../../../stores/PQQuizStore';
import PQQuizActions from './../../../actions/PQQuizActions';

import PQPageTemplate from './../../PQPageTemplate';
import PQFeedback from './../PQFeedback';

import QLVideoPlayer from './../../../../quizApp/components/QLVideoPlayer';

type State = {
    quiz: ?PQQuizClass;
    question: ?PQQuestionClass;
    completed: ?boolean;
}

//var params = urlParams();
//var quizId = params.quizId;

class PQQuiz extends React.Component {

    state: State;

    constructor(props: Object) {
        super(props);
        PQQuizStore.getQuiz(props.quizId);
        this.state = {
            quiz: null,
            question: null,
            completed: null
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange() {
        var quiz: PQQuizClass = PQQuizStore.getQuiz(this.props.quizId);
        if (quiz) {
            var question: PQQuestionClass = quiz.getCurrentQuestion();
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

    _onSelect(userAnswer: Object) {
        if (userAnswer && this.state.quiz && this.state.question) {
            var answer: Object = userAnswer;
            var quiz: PQQuizClass = this.state.quiz;
            var question: PQQuestionClass = this.state.question;
            console.log('User answer: ', this.state.quiz, this.state.question);
            PQQuizActions.answerQuestion(
                quiz.uuid,
                question,
                answer,
                5000 // TODO: Math.max(new Date().getTime() - startTime - 2000, 0)
            );
        }
    }

    _onNext() {
        var quiz: PQQuizClass = PQQuizStore.getQuiz(this.props.quizId);
        if (quiz.questionIndex + 1 === this.state.quiz.questionCount) {
            this.setState({
                completed: true
            });
        } else {
            var question: PQQuestionClass = quiz.getNextQuestion();
            this.setState({
                question: question.toObject()
            });
        }
    }

    render(): any {

        var content = null;
        if (this.state.quiz) {
            if (this.state.completed) {
                // Feedback
                content = (<PQFeedback quizId={this.props.quizId}/>);
            } else {
                // Quiz
                var questionIndex: number = PQQuizStore.getQuestionIndex(this.props.quizId);
                var currentQuiz : ?PQQuizClass = this.state.quiz;
                if (currentQuiz != null) {
                    let totalScore = currentQuiz.result ? currentQuiz.result.totalScore : 0;
                    content = (
                        <div className="container">
                            <div className="ql-score">
                                <div className="score"><h2 className="ng-binding">{totalScore} pts</h2></div>
                                <div className="questions"><h2 className="ng-binding">Q: {questionIndex + 1}/{currentQuiz.questionCount}</h2></div>
                            </div>
                            <QLVideoPlayer
                                currentQuiz={this.state.quiz}
                                quizData={this.state.quiz}
                                questionData={this.state.question}
                                questionIndex={questionIndex}
                                startTime={Date.now()}
                                onSelect={this._onSelect.bind(this)}
                                onNext={this._onNext.bind(this)}
                            />
                        </div>
                    );
                }
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
