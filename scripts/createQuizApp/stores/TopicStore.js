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

var _temporaryTopic;


var createTopicTree = function(data){
    subjectHash = {};
    data.psubjects.forEach((subject) => {
        subjectHash[subject.uuid] = {uuid: subject.uuid, name: subject.name};
    })
    _topicTree = data.pcategories;
    _dtopics = data.categories;
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

var createUserTopicTree = function(data){
    _topicUserTree = [];
    _topicUserTree = data.filter(t => t.parentCategoryId === '-1');
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
        if (topicId=="-1") {
            return _temporaryTopic;
        }
        else {
            var result = getAllTopics().filter(t => t.uuid === topicId);
            return result.length === 1 ? result[0] : undefined;
        }
    },

    getTopicByName: function(topicName){
        var result = getAllTopics().filter(t => t.name === topicName);
        if (result.length === 0){
            result = _topics.filter(t => t.name === topicName );
        }
        return result.length > 0 ? result[0] : undefined;
    },

    getFullTopicName: function(topicId){
        var topicList = function(array, prefix){
            var result = [];
            array.forEach( el => {

                var name = prefix ? `${prefix} > ${el.name}` : el.name;

                result.push({
                    name: name,
                    id: el.uuid
                });

                if (el.categories && el.categories.length > 0){
                    topicList(el.categories, name);
                }

            });
            return result;
        };

        var list = topicList(this.getAllTopics());
        var topic = list.filter(t => t.id === topicId);
        return topic ? topic[0] : undefined;
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
            createTopicTree(action.payload.topics);
            createUserTopicTree(action.payload.utopics);
            TopicStore.emitChange();
            break;

        case TopicConstants.TOPIC_ADDED:
            _topics.push(action.payload);
            TopicStore.emitChange();
            break;

        case TopicConstants.PUBLIC_TOPICS_LOADED:
            storeInit = true;
            createTopicTree(action.payload);
            TopicStore.emitChange();
            break;

        case TopicConstants.TOPICS_LOADED:
            createUserTopicTree(action.payload);
            break;
        case TopicConstants.TEMPORARY_TOPIC_ADDED:
            _temporaryTopic = action.payload;
        default:
            // no op
    }
});

module.exports = TopicStore;
