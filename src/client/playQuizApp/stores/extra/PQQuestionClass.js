/* @flow */
export default class PQQuestion {
    _question: Object;
    _status: number;

    constructor(newQuestion: Object){
        this._question = newQuestion;
        this._status = 0;
    }

    getStatus(): number{
        return this._status;
    }

    toObject(): Object{
        return this._question;
    }



}
