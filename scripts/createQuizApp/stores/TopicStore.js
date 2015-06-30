var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants = require('createQuizApp/constants/TopicConstants');
var QuizConstants = require('createQuizApp/constants/QuizConstants');

var TopicActions = require('createQuizApp/actions/TopicActions');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var storeInit = false;

var _alltopics = [];

//public subjects
var subjectHash;
var _allSubjects;

//these are publicTopics + custom topics (not subtopics)
var _topicTree;
var _topicUserTree;
var _temporaryTopic;
var _userTopics;

var createUserTopicTree = function(data){
    if (data === undefined) { return; }
    if (!_topicUserTree) {
        _topicUserTree = data.slice();
        console.warn('_topicUserTree 1', _topicUserTree);
        _topicUserTree.forEach((parentTopic) => {
            var childrenTopics = _topicUserTree.filter(childs => (childs.parentCategoryId === parentTopic.uuid));
            childrenTopics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
            parentTopic.categories = childrenTopics;
        });
        if (_topicTree) {
            _topicTree.forEach((parentTopic) => {
                var childrenTopics = _topicUserTree.filter(childs => (childs.parentCategoryId === parentTopic.uuid));
                parentTopic.categories.push.apply(parentTopic.categories, childrenTopics);
                parentTopic.categories.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
            });
        }

        _topicUserTree = _topicUserTree.filter(t => t.parentCategoryId === '-1');
        _topicUserTree.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        _alltopics = _alltopics.concat(data);
        console.warn('_topicUserTree 2', _alltopics, data);
    }
};


var createTopicTree = function(data){
    if (!_topicTree) {
        subjectHash = {};
        _allSubjects = data.psubjects;
        _allSubjects.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        data.psubjects.forEach((subject) => {
            subjectHash[subject.uuid] = {uuid: subject.uuid, name: subject.name};
        });
        _topicTree = data.pcategories;
        var _dtopics = data.categories;
        _topicTree.forEach((parentTopic) => {
            var childrenTopics = _topicTree.filter(childs => (childs.parentCategoryId === parentTopic.uuid && !childs.subContent));
            childrenTopics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
            parentTopic.categories = childrenTopics;
        });

        _dtopics.forEach((parentTopic) => {
            var childrenTopics = _dtopics.filter(childs => (childs.parentCategoryId === parentTopic.uuid && !childs.subContent));
            childrenTopics.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
            parentTopic.categories = childrenTopics;
        });

        _topicTree.push.apply(_topicTree, _dtopics);
        _alltopics.push.apply(_alltopics, data.pcategories.slice(), data.categories.slice());
        _topicTree = _topicTree.filter(t => t.parentCategoryId === '-1' || t.parentCategoryId === null);

        _topicTree.forEach((parentTopic) => {
            if (parentTopic.subjectId) {
                parentTopic.name = subjectHash[parentTopic.subjectId].name + " > " + parentTopic.name;
            }
        });
        _topicTree.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
    }
    createUserTopicTree(_userTopics);
};


var addUserTopic = function(topic) {
    _alltopics.push(topic);
    if (topic.parentCategoryId === "-1") {
        topic.categories = [];
        _topicUserTree.push(topic);

    }
    else {
        var parentTopic = _topicUserTree.filter(t => (t.uuid === topic.parentCategoryId));
        if (parentTopic.length === 0) {
            parentTopic = _topicTree.filter(t => (t.uuid === topic.parentCategoryId));
        }
        console.log('parentTopic', parentTopic);
        if (parentTopic[0]){

            parentTopic[0].categories.push(topic);
            parentTopic[0].categories.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        }
    }

};

var getAllTopics = function() {

    return _alltopics.slice();
    /*if (_topicUserTree) {
        return _topicUserTree.slice().concat(_topicTree.slice());
    }
    else {
        return _topicTree ? _topicTree.slice() : [];
    }*/
};

var TopicStore = assign({}, EventEmitter.prototype, {

    getAllTopics: function(parentCategoryId){
        if (parentCategoryId === undefined) {
            return getAllTopics();
        }
        else {
            var allTopics = getAllTopics();
            allTopics = allTopics.filter(function(t) { return t.uuid === parentCategoryId; });
            if (allTopics.length > 0) {
                return allTopics[0].categories;
            }
            return [];
        }
    },

    getTopics: function() {
        return _topicUserTree.slice();
    },

    getPublicTopics: function(){
        return _topicTree ? _topicTree.slice() : [];
    },

    getPublicSubjects: function(){
        return _allSubjects ? _allSubjects.slice() : [];
    },

    getTopicById: function(topicId){
        if (topicId === "-1") {
            return _temporaryTopic;
        }
        else {
            var result = getAllTopics().filter(t => t.uuid === topicId);
            console.log('result', getAllTopics().length, getAllTopics()[453], topicId, result);
            return result.length === 1 ? result[0] : undefined;
        }
    },

    getTopicByName: function(topicName){
        if (_temporaryTopic && _temporaryTopic.name === topicName) {
            return _temporaryTopic;
        }
        else {
            var result = getAllTopics().filter(t => t.name === topicName);
            return result.length === 1 ? result[0] : undefined;
        }
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
            //createUserTopicTree(action.payload.utopics);
            TopicStore.emitChange();
            break;

        case TopicConstants.TOPIC_ADDED:
            addUserTopic(action.payload);
            TopicStore.emitChange();
            break;

        case TopicConstants.PUBLIC_TOPICS_LOADED:
            storeInit = true;
            createTopicTree(action.payload);
            TopicStore.emitChange();
            break;

        case TopicConstants.TOPICS_LOADED:
            _userTopics = action.payload;
            break;
        case TopicConstants.TEMPORARY_TOPIC_ADDED:
            _temporaryTopic = action.payload;
            break;
        default:
            // no op
    }
});

module.exports = TopicStore;
