/* @flow */
import React from 'react';

import type {Question} from './../../../../../types';
import PQQuizStore from './../../../stores/PQQuizStore';
import PQLink from './../../utils/PQLink';
import PQPageTemplate from './../../PQPageTemplate';
import QLConversation, {startConversation} from './../../../../quizApp/components/QLConversation';
import QLMultiple from './../../../../quizApp/components/QLMultiple';
import QLVideoPlayer from './../../../../quizApp/components/QLVideoPlayer';

import settings from 'quizApp/config/settings';

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

    getQuizResult() {
        return this.state.quiz.result || { quizId: this.state.quiz.uuid, totalScore: 0, questionCount: this.state.quiz.payload.questions.length, report: [], correct: 0, latexEnabled: !!this.state.quiz.latexEnabled }
    }

    answerQuestion(idx, questionData, response, duration){
        var currentQuizResult = this.getQuizResult();

        //var question = this.state.quiz.payload.questions[idx];
        var question = this.state.quiz.payload.questions.find((element) => (element.uuid === idx));
        if (currentQuizResult.processing) {
            delete currentQuizResult.processing[question.uuid];
        }
        var questionDuration = question.duration || settings.maxTime / 1000;

        var correct = (response.toUpperCase().replace(/\s/g, "") == questionData.answerObject.text.toUpperCase().replace(/\s/g, ""));
        // TODO: var score = calculateScore(correct, duration, questionDuration);
        var score = 10;
        var parameters = {
            definition: {
                type: question.uuid,
                name: question.questionObject.text,
                score: settings.maxScore,
                duration: questionDuration,
                response: question.answer
            },
            result: {
                score: score,
                correct: correct,
                attempts: 1,
                response: response,
                duration: duration
            },
            extensions: {},
            attributes: {}
        };

        if (question.topicId) {
            parameters.extensions["categoryId"] = question.topicId;
        }
        if (question.imageURL) {
            parameters.attributes["image_url"] = question.imageURL;
        }
        if (questionData.expObject.text) {
            parameters.attributes["explanation"] = questionData.expObject.text;
        }
        if (question.latexEnabled == true) {
            parameters.attributes["latex"] = true;
        }

        if (currentQuizResult.currentActivityId !== undefined) {
            console.log('currentQuizResult.currentActivityId, parameters', currentQuizResult.currentActivityId, parameters);
            zzish.logActionWithObjects(currentQuizResult.currentActivityId, parameters);
        }

        if(correct) {
            currentQuizResult.correct++;
            currentQuizResult.totalScore += score;
        }

        var reportItem = {
            id: idx,
            question: questionData.questionObject,
            questionId: question.uuid,
            response: response,
            answer: questionData.answerObject.text,
            attempts: 1,
            correct: correct,
            score: score,
            latexEnabled: question.latexEnabled,
            roundedScore: Math.round(score),
            seconds: Math.ceil(duration/1000),
            topicId: question.topicId,
            duration: duration
        };
        var existingReport = currentQuizResult.report.filter(function(i) {
            return i.id == idx;
        });
        if (existingReport.length == 0) {
            currentQuizResult.report.push(reportItem);
        }
        else {
            existingReport[0].attempts++;
            existingReport[0].correct = reportItem.correct;
            existingReport[0].duration += reportItem.duration;
            existingReport[0].seconds += reportItem.seconds;
            existingReport[0].score = reportItem.score / existingReport[0].attempts;
            existingReport[0].roundedScore = Math.round(existingReport[0].score);
            existingReport[0].response = reportItem.response;
        }
        //setDataValue("currentQuizResult", JSON.stringify(currentQuizResult));

        this.setState({
            quiz: Object.assign(this.state.quiz, { result: currentQuizResult})
        });
    }

    _onSelect(userAnswer) {
        this.answerQuestion(
            this.state.question.uuid,
            this.state.question,
            userAnswer,
            5000 // TODO: Math.max(new Date().getTime() - startTime - 2000, 0)
        );
    }

    _onNext() {
        var quiz = PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
        var question: Question = quiz.getQuestion();
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

            var quiz = PQQuizStore.getQuiz('9b8f788f-7889-488e-ba33-a82c56f04c47');
            multiple = (
                <QLMultiple
                    currentQuiz={this.state.quiz}
                    quizData={this.getQuizResult()}
                    question={this.state.question.question}
                    alternatives={this.state.question.alternatives}
                    questionData={this.state.question}
                    questionIndex={quiz.questionIndex - 1}
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

                {multiple}

            </PQPageTemplate>
        );
    }
}

export default PQSplash;
