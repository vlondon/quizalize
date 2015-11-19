/* @flow */

import type {Question} from './../../../../types';

export default class PQQuestion {
    _question: Object;
    _status: number;

    constructor(newQuestion: Question){
        this._question = newQuestion;
        this._status = 0;
        this._question.duration = newQuestion.duration || 60;
    }

    getStatus(): number{
        return this._status;
    }

    toObject(): Object{
        return this._question;
    }

}
