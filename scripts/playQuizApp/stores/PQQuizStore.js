/* @flow */

import PQStore from './PQStore';
import PQQuizActions from './../actions/PQQuizActions';

var _fullQuizzes = {};


class PQQuizStore extends PQStore {

    getQuiz(quizId): Object{
        var fullQuiz = _fullQuizzes[quizId];
        if (fullQuiz === undefined){
            PQQuizActions.loadQuiz(quizId);
        }
        return fullQuiz;
    }

}

var PQQuizStoreInstance = new PQQuizStore();

export default PQQuizStoreInstance;
