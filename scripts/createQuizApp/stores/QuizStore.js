/* @flow */
import Store from './Store';
import UserStore from './UserStore';
var uuid            = require('node-uuid');

var AppDispatcher   = require('./../dispatcher/CQDispatcher');
var QuizConstants   = require('./../constants/QuizConstants');
var QuizActions     = require('./../actions/QuizActions');
var TopicStore      = require('./../stores/TopicStore');


type QuizCategory = {
    name: string;
    title: string;
}
type QuizMeta = {
    authorId: string;
    categoryId: string;
    code: string;
    created: number;
    imageUrl: ?string;
    name: string;
    originalQuizId: ?string;
    profileId: string;
    random: boolean;
    subject: ?string;
    updated: number;
    review: any;
    comment: any;
    price: number;
    published: string;
};

type Question = {
    uuid: string;
    question: string;
    answer: string;
}
type QuizPayload = {
    questions: Array<Question>;
}
export type QuizComplete = {
    uuid: string;
    meta: QuizMeta;
    payload: QuizPayload;
}

export type Quiz = {
    uuid: string;
    meta: QuizMeta;
    _category: QuizCategory;
}



var _quizzes: Array<Quiz> = [];

var _publicQuizzes = [];
var _fullQuizzes = {};
var storeInit = false;
var storeInitPublic = false;

var QuestionObject = function(quiz){

    var question = {
        alternatives: ['', '', ''],
        question: '',
        answer: '',
        latexEnabled: false,
        imageEnabled: false,
        uuid: uuid.v4()
    };

    if (quiz && quiz.payload.questions.length > 0) {
        var lastQuestion = quiz.payload.questions[quiz.payload.questions.length - 1];
        question.latexEnabled = lastQuestion.latexEnabled || false;
        question.imageEnabled = lastQuestion.imageEnabled || false;
    }

    return question;
};

class QuizStore extends Store {

    token: string;

    getQuizzes(): Array<Quiz> {
        return _quizzes.slice();
    }

    getQuizMeta(quizId): Quiz {
        var result = _quizzes.filter(t => t.uuid === quizId);
        return result.length === 1 ? result.slice()[0] : _fullQuizzes[quizId];

    }

    getQuiz(quizId): QuizComplete{
        var fullQuiz = _fullQuizzes[quizId];
        if (fullQuiz === undefined){
            QuizActions.loadQuiz(quizId);
        }
        return fullQuiz;
    }

    getQuestion(quizId, questionIndex){
        var quiz = this.getQuiz(quizId);
        var question = quiz.payload.questions[questionIndex] || new QuestionObject(quiz);
        return question;
    }

    getPublicQuizzes(){
        return _publicQuizzes.slice().reverse();
    }

    getQuizzesForProfile(profileId) {
        return _publicQuizzes.filter(quiz => quiz.meta.profileId === profileId).slice().reverse();
    }

    addChangeListener(callback){
        if (UserStore.getUser() && !storeInit) {
            QuizActions.loadQuizzes();
            storeInit = true;
        }
        if (!storeInitPublic) {
            QuizActions.searchPublicQuizzes();
            storeInitPublic = true;
        }
        super.addChangeListener(callback);
    }

    /**
     * is Quizzes Init
     */
    isInitData () {
        return storeInit;
    }

    /**
     * is Quizzes Init
     */
    isInitPublicData () {
        return storeInitPublic;
    }
}

var quizStoreInstance = new QuizStore();
export default quizStoreInstance;
// Register callback to handle all updates
quizStoreInstance.token = AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case QuizConstants.QUIZZES_LOADED:
            AppDispatcher.waitFor([
                TopicStore.dispatchToken
            ]);
            _quizzes = action.payload.quizzes;
            _quizzes.sort((a, b)=> a.meta.updated > b.meta.updated ? 1 : -1 );
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_LOADED:
            AppDispatcher.waitFor([
                TopicStore.dispatchToken
            ]);
            var quiz = action.payload;
            _fullQuizzes[quiz.uuid] = quiz;
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZZES_PUBLIC_LOADED:
            _publicQuizzes = action.payload;
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_DELETED:
            var quizIdToBeDeleted = action.payload;
            var quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            quizStoreInstance.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            var quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            quizStoreInstance.emitChange();
            break;


        case QuizConstants.QUIZ_META_UPDATED:
            var quizToBeUpdated = action.payload;
            var quizFromArray = _quizzes.filter(q => q.uuid === quizToBeUpdated.uuid)[0];
            if (quizFromArray){
                _quizzes[_quizzes.indexOf(quizFromArray)] = quizToBeUpdated;
            }


            quizStoreInstance.emitChange();
            break;

        default:
            // no op
    }
});
