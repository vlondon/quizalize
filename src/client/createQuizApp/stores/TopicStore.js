import Store from './Store';

var AppDispatcher = require('./../dispatcher/CQDispatcher');
var TopicConstants = require('./../constants/TopicConstants');
var MeStore = require('./../stores/MeStore');

var TopicActions = require('./../actions/TopicActions');


export type Topic = {
    attributes: Object;
    created: Number;
    createdString: string;
    description?: string;
    index?: number;
    name: string;
    ownerId?: string;
    revision: number;
    timestamp: number;
    timestampedString: string;
    title: string;
    type?: string;
    updated?: number;
    updatedString?: string;
    uuid: string;
}



var storeInit = false;
var storeInitPublic = false;

var _publictopics = [];
var _usertopics = [];
var _subjects = [];
var _subjectHash = {};
var _temporaryTopic = {};

var _emptyTopic: Topic = {
    attributes: {},
    created: Date.now(),
    name: '',
    timestamp: Date.now(),
    title: '',
    uuid: '-1'
};

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

class TopicStore extends Store {

    token: string;

    getPublicSubjects() : Array<Topic> {
        return _subjects;
    }

    getAllTopics(){
        return _publictopics.concat(_usertopics);
    }

    getTopicTreeForTopic(parentCategoryId) {
        var result = _publictopics.filter(t => t.parentCategoryId === parentCategoryId);
        var userResult = _usertopics.filter(t => t.parentCategoryId === parentCategoryId);
        userResult.push.apply(userResult, result);
        userResult.sort((a, b)=> (a.name > b.name) ? 1 : -1 );

        // Do not display duplicate names
        var seen = [];
        userResult = userResult.filter( u => {
            if (seen.indexOf(u.name) === -1){
                seen.push(u.name);
                return true;
            }
            return false;
        });

        return userResult;
    }

    getTopicTree() {
        var result = getTopics(_usertopics);
        result.push.apply(result, getTopics(_publictopics));
        return result;
    }

    getTopicById(identifier, topicId): ?Topic {
        if (topicId === '-1') {
            return _temporaryTopic[identifier];
        }
        else {
            var result = this.getAllTopics().filter(t => t.uuid === topicId);
            return result.length === 1 ? result.slice()[0] : undefined;
        }
    }


    getTopicByName(identifier, name) {
        var result = this.getAllTopics().filter(t => t.name === name);
        if (result.length === 1) {
            return result.slice()[0];
        } else {
            _temporaryTopic[identifier] = {
                uuid: '-1',
                name
            };
            return _temporaryTopic[identifier];
        }

    }

    getTopicName(topicId) {
        var topic = this.getTopicById("topic", topicId);
        return topic ? topic.name : '';
    }

    addChangeListener(callback) {
        if (MeStore.isLoggedIn() && !storeInit){
            storeInit = true;
            TopicActions.loadUserTopics();
        }
        if (!storeInitPublic) {
            storeInitPublic = true;
            TopicActions.loadPublicTopics();
        }
        super.addChangeListener(callback);
    }

}
var topicStoreInstance = new TopicStore();
export default topicStoreInstance;

// Register callback to handle all updates
topicStoreInstance.token = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case TopicConstants.PUBLIC_TOPICS_LOADED:
            loadPublicTopics(action.payload);
            topicStoreInstance.emitChange();
            break;
        case TopicConstants.TOPICS_LOADED:
            loadUserTopics(action.payload);
            topicStoreInstance.emitChange();
            break;
        case TopicConstants.TOPIC_ADDED:
            _usertopics.push(action.payload);
            topicStoreInstance.emitChange();
            break;
        default:
            // no op
    }
});
