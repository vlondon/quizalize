/* @flow */
import type {QuizComplete} from './../../../../types';
import PQQuestion from './PQQuestionClass';
import randomise from 'quizApp/utils/randomise';

var processInput = function(input) {
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
};

var getNumAlternvatives = function(currentQuestion) {
    var numAlternatives = 0;
    if (currentQuestion.alternatives) {
        for (var i in currentQuestion.alternatives) {
            if (currentQuestion.alternatives[i] && currentQuestion.alternatives[i] !== "") {
                numAlternatives++;
            }
        }
    }
    return numAlternatives;
};

var selectAnswerType = function(payload, currentQuestion, answerQuestion, questionIndex) {
    //we already have a question type (so don't update it)
    if (answerQuestion.type) return answerQuestion.type;
    var question = payload.questions[questionIndex];
    var patternToDected = question.answer.match(/\$\$[\s\S]+?\$\$|\$[\s\S]+?\$/g);
    var length = question.answer.length;
    var numAlternatives = getNumAlternvatives(question);
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
};

var getAlternatives = function(payload, answerObject, questionIndex){
    var question = payload.questions[questionIndex];
    var numAlternatives = getNumAlternvatives(question);
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
                var answer = processInput(q.answer);
                if(answer.text != correct){
                    answers.push(answer.text);
                }
            }
        }
        let options = randomise(answers).slice(0,3);
        options.push(answerObject.text);
        return randomise(options);
    }
};

var buildQuizObject = function(quiz: QuizComplete) : QuizComplete {
    var fullQuiz = Object.assign(quiz, {
        attributes: Object.assign({}, quiz.attributes),
        meta: Object.assign({}, quiz.meta),
        payload: Object.assign({}, quiz.payload),
        uuid: quiz.uuid,
        // TODO: report
        quizId: quiz.uuid,
        totalScore: 0,
        questionCount: quiz.payload.questions.length,
        report: [],
        correct: 0,
        latexEnabled: !!quiz.latexEnabled
    });

    fullQuiz.payload.questions.forEach(function(currentQuestion, questionIndex) {
        currentQuestion.questionObject = processInput(currentQuestion.question);
        currentQuestion.answerObject = processInput(currentQuestion.answer);
        currentQuestion.expObject = processInput(currentQuestion.answerExplanation);
        selectAnswerType(quiz.payload, currentQuestion.questionObject, currentQuestion.answerObject, questionIndex);
        if (currentQuestion.answerObject.type === "multiple") {
            currentQuestion.answerObject.alternatives = getAlternatives(fullQuiz.payload, currentQuestion.answerObject, questionIndex);
        }
    });

    return fullQuiz;
};


class PQQuiz {

    _quiz: QuizComplete;
    questionIndex: number;
    uuid: string;

    constructor(newQuiz: QuizComplete) {
        this._quiz = buildQuizObject(newQuiz);
        this.uuid = newQuiz.uuid;
        this.questionIndex = 0;
    }

    toObject(): QuizComplete {
        return this._quiz;
    }

    getQuestion(questionIndex: ?number = undefined) {
        console.log('!!!!!! getQuestion !!!!!', questionIndex);
        if (questionIndex){
            this.questionIndex = questionIndex;
        }
        var question = this._quiz.payload.questions[this.questionIndex];
        this.questionIndex += 1;
        return new PQQuestion(question);
    }

    getCurrentQuestion() {
        var question = this._quiz.payload.questions[this.questionIndex];
        return new PQQuestion(question);
    }

    getNextQuestion() {
        this.questionIndex += 1;
        var question = this._quiz.payload.questions[this.questionIndex];
        return new PQQuestion(question);
    }

}

export default PQQuiz;
