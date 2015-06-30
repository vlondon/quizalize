var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants = require('createQuizApp/constants/TopicConstants');
var UserStore = require('createQuizApp/stores/UserStore');

var TopicActions = require('createQuizApp/actions/TopicActions');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';
var storeInit = false;
var storeInitPublic = false;

var _publictopics = [];
var _usertopics = [];
var _subjects = [];
var _subjectHash = {};
var _temporaryTopic;

var loadPublicTopics = function(data) {
    _subjects = data.psubjects;
    _subjects.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
    data.psubjects.forEach((subject) => {
        _subjectHash[subject.uuid] = subject.name;
    });
    _publictopics = data.pcategories;
    _publictopics.push.apply(_publictopics, data.categories);
};

var loadUserTopics = function(data) {
    _usertopics = data;
};

var getTopics = function(topics) {
    var result = topics.filter(t => t.parentCategoryId === '-1' || t.parentCategoryId === null).slice();
    result.forEach((topic) => {
        if (topic.subjectId && !topic.init) {
            topic.name = _subjectHash[topic.subjectId] + " > " + topic.name;
            topic.init = true;
        }
    });
    result.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
    return result;
};

var TopicStore = assign({}, EventEmitter.prototype, {

    getPublicSubjects: function() {
        return _subjects;
    },

    getTopicTreeForTopic: function(parentCategoryId) {
        var result = _publictopics.filter(t => t.parentCategoryId === parentCategoryId);
        var userResult = _usertopics.filter(t => t.parentCategoryId === parentCategoryId);
        userResult.push.apply(userResult, result);
        userResult.sort((a, b)=> (a.name > b.name) ? 1 : -1 );
        return userResult;
    },

    getTopicTree: function() {
        var result = getTopics(_usertopics);
        result.push.apply(result, getTopics(_publictopics));
        return result;
    },

    getTopicById: function(topicId) {
        if (topicId === "-1") {
            return _temporaryTopic;
        }
        else {
            var result = _usertopics.filter(t => t.uuid === topicId);
            if (result.length === 0) {
                result = _publictopics.filter(t => t.uuid === topicId);
            }
            return result.length === 1 ? result.slice()[0] : undefined;
        }
    },

    getTopicByName: function(name) {
        if (_temporaryTopic && _temporaryTopic.name === name) {
            return _temporaryTopic;
        }
        else {
            var result = _usertopics.filter(t => t.name === name);
            if (result.length === 0) {
                result = _publictopics.filter(t => t.name === name);
            }
            return result.length === 1 ? result.slice()[0] : undefined;
        }
    },

    getTopicName: function(topicId) {
        var topic = TopicStore.getTopicById(topicId);
        if (topic) {
            if (topic.subjectId) {
                return _subjectHash[topic.subjectId] + " > " + topic.name;
            }
            else {
                return topic.name;
            }
        }
        return '';
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (UserStore.getUser() && !storeInit){
            storeInit = true;
            TopicActions.loadUserTopics();
        }
        if (!storeInitPublic) {
            storeInitPublic = true;
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
        case TopicConstants.PUBLIC_TOPICS_LOADED:
            storeInit = true;
            loadPublicTopics(action.payload);
            TopicStore.emitChange();
            break;
        case TopicConstants.TOPICS_LOADED:
            loadUserTopics(action.payload);
            TopicStore.emitChange();
            break;
        case TopicConstants.TOPIC_ADDED:
            _usertopics.push(action.payload);
            TopicStore.emitChange();
            break;
        case TopicConstants.TEMPORARY_TOPIC_ADDED:
            _temporaryTopic = action.payload;
            break;
        default:
            // no op
    }
});

module.exports = TopicStore;
