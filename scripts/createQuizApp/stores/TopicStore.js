var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants = require('createQuizApp/constants/TopicConstants');
var QuizConstants = require('createQuizApp/constants/QuizConstants');

var TopicActions = require('createQuizApp/actions/TopicActions');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var storeInit = false;

var _topics = [];
// subjects come (for now) from the public quizzes
var _publicTopics = [];


var sortPublicTopics = function(topics){

    var processedTopics = [];

    topics.forEach((parentTopic) => {
        var childrenTopics = topics.filter(childs => childs.parentCategoryId === parentTopic.uuid );
        parentTopic.categories = childrenTopics;
    });

    topics = topics.filter(t => t.parentCategoryId === '-1');


    return topics;
};


var TopicStore = assign({}, EventEmitter.prototype, {

    getTopics: function() {
        console.log('_topics', _topics);
        return _topics.slice();
    },

    getTopicById: function(topicId){
        var result = _publicTopics.filter(t => t.uuid === topicId);
        return result.length === 1 ? result[0] : undefined;
    },

    getPublicTopics: function(){
        console.log('_publicTopics', _publicTopics);

        return sortPublicTopics(_publicTopics.slice());
    },


    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (!storeInit){
            storeInit = true;
            TopicActions.loadPublicTopics();
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

        case TopicConstants.PUBLIC_TOPICS_LOADED:
            storeInit = true;
            _publicTopics = action.payload;
            TopicStore.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = TopicStore;
