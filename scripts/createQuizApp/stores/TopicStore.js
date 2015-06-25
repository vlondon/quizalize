var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants = require('createQuizApp/constants/TopicConstants');
var QuizConstants = require('createQuizApp/constants/QuizConstants');

var TopicActions = require('createQuizApp/actions/TopicActions');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var storeInit = false;

//these are the user defined topics (topics + subtopics)
var _topics;
//these are the developer defined topics (topics + subtopics)
var _dtopics;

//public subjects
var subjectHash;

//these are publicTopics + custom topics (not subtopics)
var _topicTree;
var _topicUserTree;
var _allTopics;


var createTopicTree = function(){
    _topicTree.forEach((parentTopic) => {
        var childrenTopics = _topicTree.filter(childs => (childs.parentCategoryId === parentTopic.uuid && !childs.subContent));
        childrenTopics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        parentTopic.categories = childrenTopics;
        if (parentTopic.subjectId) {
            parentTopic.name = subjectHash[parentTopic.subjectId].name + " > " + parentTopic.name;
        }
    })

    _dtopics.forEach((parentTopic) => {
        var childrenTopics = _dtopics.filter(childs => (childs.parentCategoryId === parentTopic.uuid && !childs.subContent));
        childrenTopics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        parentTopic.categories = childrenTopics;
    })

    var customDevTopics = _dtopics.filter(t => t.parentCategoryId === '-1');
    _topicTree.push.apply(_topicTree,customDevTopics);
    _topicTree.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
};

var createUserTopicTree = function(){
    _topicUserTree = [];
    _topicUserTree = _topics.filter(t => t.parentCategoryId === '-1');
    _topicUserTree.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
};

var getAllTopics = function() {
    if (!_allTopics) {
        if (_topicUserTree) {
            _allTopics = _topicUserTree.slice().concat(_topicTree.slice());
        }
    }
    return _allTopics;
}

var TopicStore = assign({}, EventEmitter.prototype, {

    getAllTopics: function(){
        return getAllTopics();
    },

    getTopics: function() {
        return _topicUserTree.slice();
    },

    getPublicTopics: function(){
        return _topicTree.slice();
    },

    getTopicById: function(topicId){
        var result = getAllTopics().filter(t => t.uuid === topicId);
        if (result.length === 0){
            result = _topics.filter(t => t.uuid === topicId);
        }
        return result.length === 1 ? result[0] : undefined;
    },

    getTopicByName: function(topicName){
        var result = getAllTopics().filter(t => t.name === topicName);
        if (result.length === 0){
            result = _topics.filter(t => {console.log("t.name", t.name, topicName, t.name === topicName); return t.name === topicName; });
        }
        return result.length > 0 ? result[0] : undefined;
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
            subjectHash = {};
            action.payload.psubjects.forEach((subject) => {
                subjectHash[subject.uuid] = {uuid: subject.uuid, name: subject.name};
            })
            _topicTree = action.payload.pcategories;
            _dtopics = action.payload.categories;
            createTopicTree();
            TopicStore.emitChange();
            break;

        case TopicConstants.TOPICS_LOADED:
            _topics = action.payload;
            createUserTopicTree();
            break;
        default:
            // no op
    }
});

module.exports = TopicStore;
