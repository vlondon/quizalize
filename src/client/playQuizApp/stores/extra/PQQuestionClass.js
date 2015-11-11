/* @flow */
export default class PQQuestion {
    _question: Object;
    _status: number;

    constructor(newQuestion: Object){
        this._question = newQuestion;
        this._status = 0;
        this._question.report = [];
        this._question.duration = newQuestion.duration || 60;
    }

    getStatus(): number{
        return this._status;
    }

    toObject(): Object{
        return this._question;
    }

}
