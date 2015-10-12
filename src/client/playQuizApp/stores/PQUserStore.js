/* @flow */

import PQStore from './PQStore';

var AppDispatcher = require('./../dispatcher/PQDispatcher');
var UserConstants = require('./../constants/UserConstants');
// var UserActions = require('./../actions/UserActions');


var storeInit = false;
var _user: Object = {};
var _users = {};

class PQUserStore extends PQStore {

    constructor(){
        super();
    }

    getUser():Object {
        return _user;
    }


    isLoggedIn(): boolean {
        return !!_user.uuid;
    }


    getPublicUser(userId: string): Object{
        var user = _users[userId];
        if (user === undefined){
            // UserActions.getPublicUser(userId);
            _users[userId] = null;
        }
        return user;
    }

    isAdmin(): boolean {
        var admins = ['Quizalize Team', 'BlaiZzish', 'Zzish', 'FrancescoZzish', 'SamirZish', 'CharlesZzish'];
        return admins.indexOf(_user.name) !== -1;
    }


    addChangeListener(callback: Function) {
        if (!storeInit){
            storeInit = true;
            // UserActions.request();
        }
        super.addChangeListener(callback);

    }
}

var userStore = new PQUserStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    // var text;
    console.info('action', action);
    switch(action.actionType) {
        case UserConstants.USER_DETAILS:
        case UserConstants.USER_DETAILS_UPDATED:
        case UserConstants.USER_IS_LOGGED:
        case UserConstants.USER_PROFILE_UPDATED:
        case UserConstants.USER_REGISTERED:
            _user = action.payload;
            userStore.emitChange();
            break;
        //
        //
        case UserConstants.USER_IS_NOT_LOGGED:
        case UserConstants.USER_LOGOUT:
            _user = {};
            userStore.emitChange();
            break;
        //
        case UserConstants.USER_LOGIN_ERROR:
            console.log('we got USER_LOGIN_ERROR', action);
            // _user = false;
            // userStore.emitChange();
            break;

        case UserConstants.USER_PUBLIC_LOADED:
            console.log('UserConstants.USER_PUBLIC_LOADED', action);
            var user = action.payload;
            _users[user.uuid] = user;
            userStore.emitChange();
            break;



        default:
            // no op
    }
});

module.exports = userStore;
