/* @flow */
import Immutable from 'immutable';
import AppDispatcher from './../dispatcher/PQDispatcher';

import PQStore from './PQStore';
import PQQuizActions from './../actions/PQQuizActions';
import PQQuizConstants from './../constants/PQQuizConstants';

import PQQuiz from './extra/PQQuizClass';
var _fullQuizzes = {};
var _quizzes = Immutable.Map();
var _categories = [];
var _subjects = [];
var storeInit = false;

class PQQuizStore extends PQStore {

    getQuiz(quizId): Object{
        var fullQuiz = _fullQuizzes[quizId];
        if (fullQuiz === undefined){
            PQQuizActions.loadQuiz(quizId);
        }
        return fullQuiz;
    }

    getQuizzes():any {
        return _quizzes;
    }
    getCategories(): any{
        return _categories;
    }
    getSubjects(): any{
        return _subjects;
    }

    addChangeListener(callback: Function) {

        if (!storeInit){
            storeInit = true;
            PQQuizActions.loadUserQuizzes();
        }

        super.addChangeListener(callback);
    }

}

var PQQuizStoreInstance = new PQQuizStore();

PQQuizStoreInstance.token = AppDispatcher.register(function(action) {

    switch (action.type) {


        case PQQuizConstants.QUIZ_LOADED:
            var quiz = action.payload;
            var newQuiz = new PQQuiz(quiz);
            _fullQuizzes[quiz.uuid] = newQuiz;
            PQQuizStoreInstance.emitChange();
            break;

        case PQQuizConstants.QUIZZES_LOADED:
            var {categories, contents, subjects} = action.payload;
            var quizzes = {};
            contents.forEach(q => quizzes[q.uuid] = q);

            // _categories = Immutable.Map(categories.map(c => {
            //     var object = {};
            //     object[c.uuid] = c;
            //     return object;
            // }));
            _quizzes = Immutable.Map(quizzes);
            // _subjects = Immutable.Map(subjects);
            PQQuizStoreInstance.emitChange();
            break;

        default:
            //noop
    }
});

export default PQQuizStoreInstance;
