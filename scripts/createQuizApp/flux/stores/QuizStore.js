var AppDispatcher = require('createQuizApp/flux/dispatcher/CQDispatcher');
var QuizConstants = require('createQuizApp/flux/constants/QuizConstants');
var QuizActions = require('createQuizApp/flux/actions/QuizActions');
var TopicStore  = require('createQuizApp/flux/stores/TopicStore');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';

var _quizzes = [];
var _fullQuizzes = {};
var _topics = [];
var init = false;



var QuizStore = assign({}, EventEmitter.prototype, {

    getQuizzes: function() {
        console.log('returning quizzes', _quizzes);
        return _quizzes;
    },

    getQuiz: function(quizId){
        return _fullQuizzes[quizId];
    },

    getTopics: function() {
        return _topics;
    },



    emitChange: function() {
        console.log('emitting');
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (!init) {
            console.log('loading quizzes');
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
        // case UserConstants.USER_DETAILS:
        //     console.log('we got action yah!', action);
        //     _user = action.payload;
        //     QuizStore.emitChange();
        //     break;
        // //
        // case UserConstants.USER_IS_LOGGED:
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



        // //
        // //
        // case UserConstants.USER_IS_NOT_LOGGED:
        //     _user = false;
        //     QuizStore.emitChange();
        //     break;
        //
        // case UserConstants.USER_LOGIN_ERROR:
        //     console.log('we got USER_LOGIN_ERROR', action);
        //     _error = action.payload;
        //     QuizStore.emitChange();
        //     break;



        default:
            // no op
    }
});
console.log('QuizStore', QuizStore);
module.exports = QuizStore;
