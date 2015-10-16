/* @flow */

import Store from './Store';

var AppDispatcher = require('./../dispatcher/CQDispatcher');
var GroupConstants = require('./../constants/GroupConstants');
var GroupActions = require('./../actions/GroupActions');

import type {Group, GroupContent} from './../../../types';

type Groups = Array<Group>;
type GroupsContent = Array<GroupContent>;

var storeInit = false;
var _storeLoaded = false;
var _groups:Groups = [];
var _groupsContent:GroupsContent = [];

class GroupStore extends Store {

    constructor(){
        super();
    }

    isLoaded():boolean{
        return _storeLoaded;
    }

    getGroups():Groups {
        return _groups;
    }


    getGroupsContent():GroupsContent {
        return _groupsContent;
    }



    /**
     * @param {function} callback
     */
    addChangeListener(callback: Function) {
        if (!storeInit) {
            storeInit = true;
            GroupActions.loadGroups();
        }
        super.addChangeListener(callback);

    }


}

var groupStoreInstance = new GroupStore();
// Register callback to handle all updates
groupStoreInstance.token = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case GroupConstants.GROUPS_LOADED:
            _groups = action.payload.groups;
            _storeLoaded = true;
            _groupsContent = action.payload.groupsContent;
            groupStoreInstance.emitChange();
            break;

        case GroupConstants.NEW_GROUP_PUBLISHED:
            var newGroup = action.payload;
            newGroup.name = newGroup.groupName;
            delete newGroup.groupName;
            _groups.push(newGroup);
            groupStoreInstance.emitChange();
            break;


        default:
            // no op
    }
});

export default groupStoreInstance;
