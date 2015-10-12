/* @flow */
import type {QuizComplete} from './../../../createQuizApp/stores/QuizStore';
import PQQuestion from './PQQuestionClass';
class PQQuiz {

    _quiz: QuizComplete;
    questionIndex: number;
    uuid: string;

    constructor(newQuiz:QuizComplete){
        this._quiz = newQuiz;
        this.uuid = newQuiz.uuid;
        this.questionIndex = 0;
    }

    toObject() : QuizComplete {
        return this._quiz;
    }


    getQuestion(questionIndex: ?number = undefined){
        if (questionIndex){
            this.questionIndex = questionIndex;
        }
        var question  = this._quiz.payload.questions[this.questionIndex];
        this.questionIndex += 1;
        return new PQQuestion(question);
    }
}

export default PQQuiz;
