/* @flow */

import settings from './../../quizApp/config/settings';
import AppDispatcher  from './../dispatcher/PQDispatcher';
import PQQuizConstants from './../constants/PQQuizConstants';
import PQQuizStore from './../stores/PQQuizStore';
import PQQuiz from './../stores/extra/PQQuizClass';

class PQQuizActions  {

    loadQuiz(quizId: string) {
        window.zzish.getPublicContent('quiz', quizId, function (err, quiz) {
            console.log('err', PQQuizConstants.QUIZ_LOADED);
            console.log('message', quiz);

            if (err){
                console.error('Error', err);
            } else {
                AppDispatcher.dispatch({
                    type: PQQuizConstants.QUIZ_LOADED,
                    payload: quiz
                });
            }
        });
    }

    answerQuestion(quizId: string, questionData: Object, response: Object, duration: number) {
        var questionId = questionData.uuid;
        var quizInstance = PQQuizStore.getQuiz(quizId);
        var quiz = quizInstance.toObject();
        console.log('ANSWER -------- ', quizId, questionId);
        var currentQuizResult = quiz; // || { quizId: quiz.uuid, totalScore: 0, questionCount: quiz.payload.questions.length, report: [], correct: 0, latexEnabled: !!quiz.latexEnabled };

        //var question = quiz.payload.questions[questionId];
        var question = quiz.payload.questions.find((element) => (element.uuid === questionId));
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
            // zzish.logActionWithObjects(currentQuizResult.currentActivityId, parameters);
        }

        if(correct) {
            currentQuizResult.correct++;
            currentQuizResult.totalScore += score;
        }

        var reportItem = {
            id: questionId,
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
        console.log('reportItem: ', reportItem);
        var existingReport = currentQuizResult.report.filter(function(i) {
            return i.id == questionId;
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

        //this.setState({
        //    quiz: Object.assign(quiz, { result: currentQuizResult})
        //});

        //quiz.result = currentQuizResult;

        console.log('Object.assign(quiz, { result: currentQuizResult}): ', Object.assign(quiz, { result: currentQuizResult}));
        quiz = (Object.assign(quiz, { result: currentQuizResult}));
        AppDispatcher.dispatch({
            type: PQQuizConstants.QUESTION_ANSWERED,
            payload: quizInstance // quizInstance.setQuiz(Object.assign(quiz, { result: currentQuizResult}))
        });
    }
}

var pqQuizActionsInstance = new PQQuizActions();
export default pqQuizActionsInstance;
