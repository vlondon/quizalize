var AppDispatcher = require('createQuizApp/flux/dispatcher/CQDispatcher');
var GroupConstants = require('createQuizApp/flux/constants/GroupConstants');


var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';

var _groups = [];
var _groupsContent = [];

var GroupStore = assign({}, EventEmitter.prototype, {

    getGroups: function() {
        return _groups;
    },

    getGroupsContent: function() {
        return _groupsContent;
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
GroupStore.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case GroupConstants.GROUPS_LOADED:

            _groups = action.payload.groups;
            _groupsContent = action.payload.groupsContent;
            GroupStore.emitChange();
            break;



        default:
            // no op
    }
});

module.exports = GroupStore;
