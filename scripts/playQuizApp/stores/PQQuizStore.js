/* @flow */

import AppDispatcher from './../dispatcher/PQDispatcher';

import PQStore from './PQStore';
import PQQuizActions from './../actions/PQQuizActions';
import PQQuizConstants from './../constants/PQQuizConstants';

import PQQuiz from './extra/PQQuizClass';
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

PQQuizStoreInstance.token = AppDispatcher.register(function(action) {


    console.log('yay!', PQQuizConstants.QUIZ_LOADED, action);
    switch (action.type) {

        case PQQuizConstants.QUIZ_LOADED:
            var quiz = action.payload;
            var newQuiz = new PQQuiz(quiz);
            console.log('newQuiz', newQuiz.toObject());
            _fullQuizzes[quiz.uuid] = newQuiz;
            PQQuizStoreInstance.emitChange();
            break;

        default:
            //noop
    }
});

export default PQQuizStoreInstance;
