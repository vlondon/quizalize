/* @flow */
import React from 'react';

import type {Question} from './../../../../../types';
import PQQuizStore from './../../../stores/PQQuizStore';
import PQQuizActions from './../../../actions/PQQuizActions';
import PQLink from './../../utils/PQLink';
import PQPageTemplate from './../../PQPageTemplate';
import QLConversation, {startConversation} from './../../../../quizApp/components/QLConversation';
import QLMultiple from './../../../../quizApp/components/QLMultiple';
import QLVideoPlayer from './../../../../quizApp/components/QLVideoPlayer';

type State = {
    question?: Question;
}

var quizId = '7f397534-fb8c-4c1e-8d72-f0a4c95774ae'; // 9b8f788f-7889-488e-ba33-a82c56f04c47

class PQSplash extends React.Component {

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
        //var conversation = null;
        var multiple = null;

        if (this.state.quiz) {
            //conversation = (
            //    <QLConversation quiz={this.state.quiz} />
            //);

            //multiple = (
            //    <QLMultiple
            //        currentQuiz={this.state.quiz}
            //        quizData={this.getQuizResult()}
            //        question={this.state.question.question}
            //        alternatives={this.state.question.alternatives}
            //        questionData={this.state.question}
            //        questionIndex={quiz.questionIndex - 1}
            //        startTime={Date.now()}
            //        onSelect={this._onSelect.bind(this)}
            //        onNext={this._onNext.bind(this)}
            //    />
            //);

            var quiz = PQQuizStore.getQuiz(quizId);
            var player = (
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
                <h1>Splash</h1>
                <p>
                    <PQLink href='/play/class'>Log in as a student</PQLink>
                </p>

                {
                    //conversation
                }

                {
                    //multiple
                }

                {
                    player
                }

            </PQPageTemplate>
        );
    }
}

export default PQSplash;
