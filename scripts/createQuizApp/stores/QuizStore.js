var AppDispatcher   = require('createQuizApp/dispatcher/CQDispatcher');
var QuizConstants   = require('createQuizApp/constants/QuizConstants');
var QuizActions     = require('createQuizApp/actions/QuizActions');
var TopicStore      = require('createQuizApp/stores/TopicStore');
var EventEmitter    = require('events').EventEmitter;
var assign          = require('object-assign');
var uuid            = require('node-uuid');

var CHANGE_EVENT = 'change';

var _quizzes = [];
var _publicQuizzes = [];
var _fullQuizzes = {};
var _topics = [];
var storeInit = false;
var storeInitPublic = false;

var QuestionObject = function(quiz){

    var question = {
        alternatives: ['', '', ''],
        question: '',
        answer: '',
        uuid: uuid.v4()
    };
    if (quiz && quiz.questions.length > 0) {
        var lastQuestion = quiz.questions[quiz.questions.length - 1];
        question.latexEnabled = lastQuestion.latexEnabled;
        question.imageEnabled = lastQuestion.imageEnabled;
    }

    return question;
};



var QuizStore = assign({}, EventEmitter.prototype, {

    getQuizzes: function() {
        return _quizzes;
    },

    getQuiz: function(quizId){
        return _fullQuizzes[quizId];
    },

    getQuestion: function(quizId, questionIndex){
        var quiz = this.getQuiz(quizId);
        var question = quiz.questions[questionIndex] || new QuestionObject(quiz);
        return question;
    },

    getPublicQuizzes: function(){
        if (!storeInitPublic){
            storeInitPublic = true;
            QuizActions.loadPublicQuizzes();
        }
        return _publicQuizzes;
    },

    getTopics: function() {
        return _topics;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (!storeInit) {
            QuizActions.loadQuizzes();
            storeInit = true;
        }
        this.on(CHANGE_EVENT, callback);
    },

    /**
     * @param {function} callback
     */
    removeChangeListener: function(callback) {
        this.removeListener(CHANGE_EVENT, callback);
    }
});


// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {

        case QuizConstants.QUIZZES_LOADED:
            _quizzes = action.payload.quizzes;
            _topics = action.payload.topics;
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
            // I can't update quizzes yet because the category needs to be set up
            // var i = _quizzes.filter(q=> q.uuid === quizAdded.uuid);
            // if (i.length === 0){
            //     _quizzes.push(quizAdded);
            // }
            QuizActions.loadQuizzes();
            QuizStore.emitChange();
            break;


        default:
            // no op
    }
});
module.exports = QuizStore;
