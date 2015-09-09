/* @flow */

import Store from './Store';
import UserIdStore from './UserIdStore';

var AppDispatcher = require('./../dispatcher/CQDispatcher');
var UserConstants = require('./../constants/UserConstants');
var UserActions = require('./../actions/UserActions');
var intercom = require('./../utils/intercom');

var intercomId = window.intercomId;
var intercomAdded = false;


type UserAttributes = {
    location?: string;
    school?: string;
    url?: string;
    subjectTaught?: string;
    ageTaught?: string;
    profileUrl?: string;
    bannerUrl?: string;
};
export type User = {
    uuid: string;
    avatar: string;
    email: string;
    name: string;
    attributes: UserAttributes;
    created: number;
}

var noUser:User = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: {},
    created: Date.now()
};

var storeInit = false;
var _user:User = noUser;
var _users = {};
var _usersByUrl = {};
var _loginEmail = '';

class UserStore extends Store {

    constructor(){
        super();
    }

    getUserLoginEmail() : string{
        return _loginEmail;
    }

    getUser():User {
        return _user;
    }

    getUserId(): ?string {
        if (this.isLoggedIn()){
            return _user.uuid;
        } else {
            return undefined;
        }
    }


    isLoggedIn(): boolean {
        return (_user && _user.uuid && _user.uuid !== '-1') ? true : false;
    }


    getPublicUser(userId: string): Object{
        var user = _users[userId];
        if (user === undefined){
            UserActions.getPublicUser(userId);
            _users[userId] = null;
        }
        return user;
    }

    getPublicUserByUrl(url: string): Object{
        var userId = _usersByUrl[url];
        if (userId === undefined){
            UserActions.getPublicUserByUrl(url);
            _usersByUrl[url] = null;
        }
        return userId;
    }

    isAdmin(): boolean {
        var admins = ['Quizalize Team', 'BlaiZzish', 'Zzish', 'FrancescoZzish', 'SamirZish', 'CharlesZzish'];
        if (_user && _user.name){
            return admins.indexOf(_user.name) !== -1;
        } else {
            return false;
        }
    }


    addChangeListener(callback: Function) {
        if (!storeInit){
            storeInit = true;
            UserActions.request();
        }
        super.addChangeListener(callback);

    }

    emitChange(){
        super.emitChange();
        this.addIntercom();
    }

    addIntercom(){

        var currentUser = this.getUser();

        if (this.isLoggedIn()){
            window.intercomSettings = {
                name: (currentUser.name || currentUser.email),
                email: (currentUser.email),
                created_at: Math.round((currentUser.created / 1000)),
                app_id: intercomId
            };
        } else {
            window.intercomSettings = {
                app_id: intercomId
            };
        }

        var value = intercomAdded ? 'updated' : 'boot';

        console.log('intercom', value, window.intercomSettings);
        intercom(value, window.intercomSettings);
        intercomAdded = true;

    }
}

var userStore = new UserStore();
export default userStore;

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
            UserIdStore.setUserId(_user.uuid);
            userStore.emitChange();
            break;
        //
        //
        case UserConstants.USER_IS_NOT_LOGGED:
        case UserConstants.USER_LOGOUT:
            _user = noUser;
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

        case UserConstants.USER_PUBLIC_LOADED_URL:
            console.log('UserConstants.USER_PUBLIC_LOADED_URL', action);
            var user = action.payload;
            _usersByUrl[user.attributes.profileUrl] = user.uuid;
            _users[user.uuid] = user;
            userStore.emitChange();
            break;

        case UserConstants.USER_LOGIN_EMAIL_ADDED:
            _loginEmail = action.payload;
            // userStore.emitChange();
            break;


        default:
            // no op
    }
});
