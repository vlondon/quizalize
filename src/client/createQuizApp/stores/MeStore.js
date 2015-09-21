/* @flow */
import Store from './Store';
import Immutable, {Record} from 'immutable';
import AppDispatcher from './../dispatcher/CQDispatcher';
import UserConstants from './../constants/UserConstants';
import type {UserType} from './../../../types/UserType';

let noUser:UserType = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: {},
    created: Date.now(),
    quizzes: [],
    apps: []
};

const meRecord = Record(noUser);

class Me extends Store {

    state: UserType;

    constructor(state: UserType = noUser){
        super(state);
        this.state = new meRecord(state);
    }

    getState (): UserType {
        return this.state;
    }

    setState(userData : Object) {
        var quizzes = userData.quizzes;
        var apps = userData.apps
        this.state = new meRecord(userData);
        console.log('we got quizzes', quizzes, apps);
    }

    isLoggedIn() : boolean {
        var state = this.state;
        return (state.uuid !== '-1') ? true : false;
    }

}


var meStore = new Me(window._state);
export default meStore;

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case UserConstants.USER_OWN_LOADED:
            // var me = Immutable.fromJS(action.payload);
            meStore.setState(action.payload);

            break;
    };
});
