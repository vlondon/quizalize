/* @flow */

import Store from './Store';

var AppDispatcher = require('./../dispatcher/CQDispatcher');
var GroupConstants = require('./../constants/GroupConstants');
var GroupActions = require('./../actions/GroupActions');


export type Group = {
    code: string;
    link: string;
    name: string;
};
type Groups = Array<Group>;

type GroupContent = {
    access: number;
    attributes: {
        access: string;
        code: string;
    };
    contentId: string;
    created: number;
    createdString: string;
    groupCode: string;
    ownerId: string;
    profileOwnerId: string;
    revision: number;
    timestamp: number;
    timestampedString: string;
    uuid: string;
}

type GroupsContent = Array<GroupContent>;

var storeInit = false;
var _groups:Groups = [];
var _groupsContent:GroupsContent = [];

class GroupStore extends Store {

    constructor(){
        super();
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
