/* @flow */
import randomise from 'quizApp/utils/randomise';

import AppDispatcher from './../dispatcher/PQDispatcher';

import PQStore from './PQStore';
import PQQuizActions from './../actions/PQQuizActions';
import PQQuizConstants from './../constants/PQQuizConstants';

import PQQuiz from './extra/PQQuizClass';
var _fullQuizzes = {};


class PQQuizStore extends PQStore {

    static processInput(input) {
        if (input) {
            if (input.indexOf("freetext://") === 0) {
                let meta = input.split("//");
                return {
                    type: "freetext",
                    text: meta[1]
                };
            }
            if (input.indexOf("scrambled://") === 0) {
                let meta = input.split("//");
                return {
                    type: "scrambled",
                    text: meta[1],
                    textArray: meta[1].split(""),
                    joiner: ""
                };
            }
            if (input.indexOf("multiple://") === 0) {
                let meta = input.split("//");
                return {
                    type: "multiple",
                    text: meta[1]
                };
            }
            if (input.indexOf("freetext://") === 0) {
                let meta = input.split("//");
                return {
                    type: "freetext",
                    text: meta[1]
                };
            }
            if (input.indexOf("video://") === 0) {
                return {
                    type: "video",
                    url: "http://" + input.substring(8),
                    text: "Video"
                };
            }
            if (input.indexOf("videos://") === 0) {
                return {
                    type: "video",
                    url: "https://" + input.substring(9),
                    text: "Video"
                };
            }
            if (input.indexOf("audio://") === 0) {
                return {
                    type: "audio",
                    url: "http://" + input.substring(8),
                    text: "Audio"
                };
            }
            if (input.indexOf("audios://") === 0) {
                return {
                    type: "audio",
                    url: "http://" + input.substring(9),
                    text: "Audio"
                };
            }
            if (input.indexOf("exp:") === 0) {
                let meta = input.split("//");
                let commands = meta[0].split(":");
                return {
                    type: "text",
                    show: parseInt(commands[1]),
                    text: meta[1]
                };
            }
            if (input.indexOf("jumble:") === 0) {
                let meta = input.split("//");
                let commands = meta[0].split(":");
                return {
                    type: "scrambled",
                    text: meta[1],
                    textArray: meta[1].split(","),
                    joiner: ","
                };
            }
            if (input.indexOf("videoq:") === 0) {
                let meta = input.split("//");
                let commands = meta[0].split(":");
                var result = {
                    type: "videoq",
                    url: commands[1],
                    start: commands[2],
                    end: commands[3],
                    text: meta[1],
                    autoPlay: 0
                };
                if (commands.length == 5) {
                    result.autoPlay = parseInt(commands[4]);
                }
                return result;
            }
        }
        return {
            text: input
        };
    }

    static getNumAlternvatives(currentQuestion) {
        var numAlternatives = 0;
        if (currentQuestion.alternatives) {
            for (var i in currentQuestion.alternatives) {
                if (currentQuestion.alternatives[i] && currentQuestion.alternatives[i] !== "") {
                    numAlternatives++;
                }
            }
        }
        return numAlternatives;
    }

    static selectAnswerType(payload, currentQuestion, answerQuestion, questionIndex) {
        //we already have a question type (so don't update it)
        if (answerQuestion.type) return answerQuestion.type;
        var question = payload.questions[questionIndex];
        var patternToDected = question.answer.match(/\$\$[\s\S]+?\$\$|\$[\s\S]+?\$/g);
        var length = question.answer.length;
        var numAlternatives = PQQuizStore.getNumAlternvatives(question);
        if(numAlternatives > 0 || patternToDected || length >= 20 || length === 1) {
            //either there are alternatives or there is a space in the anser
            answerQuestion.type = "multiple";
        }
        else {
            //var options = ["scrambled", "multiple"];
            //var ran = Math.floor(Math.random()*options.length);
            //return options[ran];
            answerQuestion.type = "scrambled";
            answerQuestion.joiner = "";
            answerQuestion.textArray = answerQuestion.text.split("");
        }
    }

    static getAlternatives(payload, answerObject, questionIndex){
        var question = payload.questions[questionIndex];
        var numAlternatives = PQQuizStore.getNumAlternvatives(question);
        if(numAlternatives > 0){
            let options = [];
            options.push(answerObject.text);
            for(let i in question.alternatives) {
                var alt = question.alternatives[i];
                if (alt!=undefined && alt.length>0) {
                    options.push(alt);
                }
            }
            return randomise(options, true);
            //return options;
        } else {
            var answers = [];
            var correct = answerObject.text;

            for(let i in payload.questions){
                var q = payload.questions[i];
                if (q.question!=question.question) {
                    var answer = PQQuizStore.processInput(q.answer);
                    if(answer.text != correct){
                        answers.push(answer.text);
                    }
                }
            }
            let options = randomise(answers).slice(0,3);
            options.push(answerObject.text);
            return randomise(options);
        }
    }

    static buildQuizObject(quiz: Object) : Object {
        var fullQuiz = Object.assign(quiz, {
            attributes: Object.assign({}, quiz._quiz.attributes),
            meta: Object.assign({}, quiz._quiz.meta),
            payload: Object.assign({}, quiz._quiz.payload),
            uuid: quiz._quiz.uuid
        });

        fullQuiz.payload.questions.forEach(function(currentQuestion, questionIndex) {
            currentQuestion.questionObject = PQQuizStore.processInput(currentQuestion.question);
            currentQuestion.answerObject = PQQuizStore.processInput(currentQuestion.answer);
            currentQuestion.expObject = PQQuizStore.processInput(currentQuestion.answerExplanation);
            PQQuizStore.selectAnswerType(quiz.payload, currentQuestion.questionObject, currentQuestion.answerObject, questionIndex);
            if (currentQuestion.answerObject.type === "multiple") {
                currentQuestion.answerObject.alternatives = PQQuizStore.getAlternatives(fullQuiz.payload, currentQuestion.answerObject, questionIndex);
            }
        });

        return fullQuiz;
    }

    getQuiz(quizId) : Object {
        var fullQuiz = _fullQuizzes[quizId];
        if (fullQuiz === undefined){
            PQQuizActions.loadQuiz(quizId);
        }
        return fullQuiz;
    }
}

var PQQuizStoreInstance = new PQQuizStore();

PQQuizStoreInstance.token = AppDispatcher.register(function(action) {


    console.log('yay!', PQQuizConstants.QUIZ_LOADED, action);
    switch (action.type) {

        case PQQuizConstants.QUIZ_LOADED:
            var quiz = action.payload;
            var newQuiz = new PQQuiz(quiz);
            console.log('newQuiz', newQuiz.toObject());
            _fullQuizzes[quiz.uuid] = PQQuizStore.buildQuizObject(newQuiz);
            PQQuizStoreInstance.emitChange();
            break;

        default:
            //noop
    }
});

export default PQQuizStoreInstance;
