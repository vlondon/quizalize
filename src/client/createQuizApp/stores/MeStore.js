/* @flow */
import Store from './Store';
import Immutable, {Record} from 'immutable';
import AppDispatcher from './../dispatcher/CQDispatcher';
import UserConstants from './../constants/UserConstants';
import type {UserType} from './../../../types/UserType';

var noUser:UserType = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: {},
    created: Date.now()
};

var meRecord = Record(noUser);
class Me extends Store {
    state: UserType;
    constructor(state: UserType = noUser){
        super(state);
        this.state = new meRecord();
    }

    getState (): UserType {
        return this.state;
    }

}


var meStore = new Me();
export default meStore;

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case UserConstants.USER_OWN_LOADED:
            // var me = Immutable.fromJS(action.payload);
            meStore.state  = new meRecord(action.payload);

            break;
    };
});
