/* @flow */

import AppDispatcher from './../dispatcher/PQDispatcher';

import PQStore from './PQStore';
import PQQuizActions from './../actions/PQQuizActions';
import PQQuizConstants from './../constants/PQQuizConstants';

import PQQuiz from './extra/PQQuizClass';
var _fullQuizzes = {};

class PQQuizStore extends PQStore {

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
    var quiz = undefined;
    switch (action.type) {
        case PQQuizConstants.QUIZ_LOADED:
            quiz = action.payload;
            let newQuiz = new PQQuiz(quiz);
            _fullQuizzes[quiz.uuid] = newQuiz;
            PQQuizStoreInstance.emitChange();
            break;

        case PQQuizConstants.QUESTION_ANSWERED:
            console.log('action.payload: ', action.payload);
            quiz = action.payload;
            console.log('QUESTION_ANSWERED for Quiz >>> ', quiz);
            _fullQuizzes[quiz.toObject().uuid] = quiz;
            PQQuizStoreInstance.emitChange();
            break;

        default:
            //noop
    }
});

export default PQQuizStoreInstance;
