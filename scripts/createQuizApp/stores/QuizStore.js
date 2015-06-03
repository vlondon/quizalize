var AppDispatcher   = require('createQuizApp/dispatcher/CQDispatcher');
var QuizConstants   = require('createQuizApp/constants/QuizConstants');
var QuizActions     = require('createQuizApp/actions/QuizActions');
var TopicStore      = require('createQuizApp/stores/TopicStore');
var EventEmitter    = require('events').EventEmitter;
var assign          = require('object-assign');


var CHANGE_EVENT = 'change';

var _quizzes = [];
var _publicQuizzes = [];
var _fullQuizzes = {};
var _topics = [];
var init = false;



var QuizStore = assign({}, EventEmitter.prototype, {

    getQuizzes: function() {
        return _quizzes;
    },

    getQuiz: function(quizId){
        return _fullQuizzes[quizId];
    },

    getPublicQuizzes: function(){
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
        if (!init) {
            QuizActions.loadQuizzes();
            init = true;
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
    // var text;

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
            _fullQuizzes[quizAdded.uuid] = quiz;
            QuizStore.emitChange();
            break;


        default:
            // no op
    }
});
module.exports = QuizStore;
