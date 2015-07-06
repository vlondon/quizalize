
/* @flow */
var EventEmitter    = require('events').EventEmitter;
var assign          = require('object-assign');
var uuid            = require('node-uuid');

var AppDispatcher   = require('./../dispatcher/CQDispatcher');
var QuizConstants   = require('./../constants/QuizConstants');
var TopicConstants  = require('./../constants/TopicConstants');
var QuizActions     = require('./../actions/QuizActions');
var TopicStore      = require('./../stores/TopicStore');
var TransactionConstants   = require('./../constants/TransactionConstants');

import UserStore               from './../stores/UserStore';

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
};

export type Quiz = {
    uuid: string;
    meta: QuizMeta;
    _category: QuizCategory;

}

var CHANGE_EVENT = 'change';


var _quizzes = [];
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

var QuizStore = assign({}, EventEmitter.prototype, {

    getQuizzes: function() {
        return _quizzes.slice();
    },

    getQuizMeta: function(quizId) {
        var result = _quizzes.filter(t => t.uuid === quizId);
        return result.length === 1 ? result.slice()[0] : _fullQuizzes[quizId];

    },

    getQuiz: function(quizId){
        var fullQuiz = _fullQuizzes[quizId];
        if (fullQuiz === undefined){
            QuizActions.loadQuiz(quizId);
        }
        return fullQuiz;
    },

    getQuestion: function(quizId, questionIndex){
        var quiz = this.getQuiz(quizId);
        var question = quiz.payload.questions[questionIndex] || new QuestionObject(quiz);
        return question;
    },

    getPublicQuizzes: function(){
        return _publicQuizzes.slice().reverse();
    },

    getQuizzesForProfile: function(profileId) {
        return _publicQuizzes.filter(quiz => quiz.meta.profileId === profileId).slice().reverse();
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (UserStore.getUser() && !storeInit) {
            QuizActions.loadQuizzes();
            storeInit = true;
        }
        if (!storeInitPublic) {
            QuizActions.searchPublicQuizzes();
            storeInitPublic = true;
        }
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    },

    /**
     * is Quizzes Init
     */
     isInitData: function() {
        return storeInit;
     },

    /**
     * is Quizzes Init
     */
     isInitPublicData: function() {
        return storeInitPublic;
     }

});


// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case QuizConstants.QUIZZES_LOADED:
            AppDispatcher.waitFor([
                TopicStore.dispatchToken
            ]);
            _quizzes = action.payload.quizzes;
            _quizzes.sort((a, b)=> a.meta.updated > b.meta.updated ? 1 : -1 );
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_LOADED:
            AppDispatcher.waitFor([
                TopicStore.dispatchToken
            ]);
            var quiz = action.payload;
            _fullQuizzes[quiz.uuid] = quiz;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZZES_PUBLIC_LOADED:
            _publicQuizzes = action.payload;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_DELETED:
            var quizIdToBeDeleted = action.payload;
            var quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            var quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            QuizStore.emitChange();
            break;


        case QuizConstants.QUIZ_META_UPDATED:
            var quizToBeUpdated = action.payload;
            var quizFromArray = _quizzes.filter(q => q.uuid === quizToBeUpdated.uuid)[0];
            if (quizFromArray){
                _quizzes[_quizzes.indexOf(quizFromArray)] = quizToBeUpdated;
            }


            QuizStore.emitChange();
            break;

        default:
            // no op
    }
});
module.exports = QuizStore;
