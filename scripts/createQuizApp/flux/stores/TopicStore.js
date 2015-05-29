var AppDispatcher = require('createQuizApp/flux/dispatcher/CQDispatcher');
var TopicConstants = require('createQuizApp/flux/constants/TopicConstants');
var QuizConstants = require('createQuizApp/flux/constants/QuizConstants');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';

var _topics = [];

var TopicStore = assign({}, EventEmitter.prototype, {


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
TopicStore.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case QuizConstants.QUIZZES_LOADED:
        case TopicConstants.TOPICS_LOADED:

            _topics = action.payload.topics;
            TopicStore.emitChange();
            break;

        case TopicConstants.TOPIC_ADDED:
            _topics.push(action.payload);
            TopicStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = TopicStore;
