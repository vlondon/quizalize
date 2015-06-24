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

    topics.forEach((parentTopic) => {
        var childrenTopics = topics.filter(childs => childs.parentCategoryId === parentTopic.uuid );
        childrenTopics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        parentTopic.categories = childrenTopics;
    });

    topics = topics.filter(t => t.parentCategoryId === '-1');
    topics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );

    return topics;
};


var TopicStore = assign({}, EventEmitter.prototype, {

    getTopics: function() {
        return _topics.slice();
    },

    getTopicById: function(topicId){
        var result = _publicTopics.filter(t => t.uuid === topicId);
        if (result.length === 0){
            result = _topics.filter(t => t.uuid === topicId);
        }
        return result.length === 1 ? result[0] : undefined;
    },

    getAllTopics: function(){
        return _topics.slice().concat(_publicTopics.slice());
    },

    getTopicByName: function(topicName){
        var result = _publicTopics.filter(t => t.name === topicName);
        if (result.length === 0){
            result = _topics.filter(t => {console.log("t.name", t.name, topicName, t.name === topicName); return t.name === topicName; });
        }
        return result.length > 0 ? result[0] : undefined;
    },

    getPublicTopics: function(){
        console.log('_publicTopics', _publicTopics);
        var publicTopics = _publicTopics ? sortPublicTopics(_publicTopics.slice()) : [];
        return publicTopics;
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
            _publicTopics = action.payload.topics;
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

        case TopicConstants.TOPICS_LOADED:
            _topics = action.payload;
            break;
        default:
            // no op
    }
});

module.exports = TopicStore;
