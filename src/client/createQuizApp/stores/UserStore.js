/* @flow */
import {Map, Record} from 'immutable';
import Store from './Store';
import AppStore from './AppStore';
import UserIdStore from './UserIdStore';
import type {UserType} from './../../../types/UserType';

var AppDispatcher = require('./../dispatcher/CQDispatcher');
var UserConstants = require('./../constants/UserConstants');
var UserActions = require('./../actions/UserActions');


var _users = Map();
var _usersByUrl = {};
var _loginEmail = '';

class UserStore extends Store {

    constructor(){
        super();
    }

    getUserLoginEmail() : string{
        return _loginEmail;
    }

    getUser() {
        console.error('UserStore.getUser() is deprecated');
        return;
    }

    getUserId() {
        console.error('UserStore.getUserId() is deprecated');
        return;
    }


    isLoggedIn() {
        console.error('UserStore.isLoggedIn() is deprecated');
        return;
    }


    getPublicUser(userId: string): Object{
        var user = _users.get(userId);
        if (user === undefined){
            UserActions.getPublicUser(userId);
            _users = _users.set(userId, null);
        } else if (user !== null && user !== undefined){
            var fillApps = (apps, quizzes)=>{
                var quizzesWithoutApps = quizzes.filter(q=>{
                    var isInApp = apps.filter(a=>{
                        var quizzes = a.meta.quizzes || [];
                        return quizzes.filter(aq=> aq.uuid === q.uuid).length !== 0;
                    });
                    return isInApp.length === 0;
                });

                var appPlaceholder = AppStore.getNewApp({
                    uuid: 'own',
                    meta: {
                        quizzes: quizzesWithoutApps,
                        colour: '#FFF',
                        name: 'Your Quizzes',
                        description: 'This is a description of your quizzes that don\'t belong to any app'
                    }
                });

                apps.push(appPlaceholder);
                return apps;
            };


            var apps = fillApps(user.apps, user.quizzes);
            user = {...user, apps};


        }
        return user;
    }

    getPublicUserByUrl(url: string): Object{
        var userId = _usersByUrl[url];
        if (userId === undefined){
            UserActions.getPublicUserByUrl(url);
            _usersByUrl[url] = null;

        }
        return _users.get(userId);
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
            _users = _users.set(user.uuid, user);
            userStore.emitChange();
            break;

        case UserConstants.USER_PUBLIC_LOADED_URL:
            console.log('UserConstants.USER_PUBLIC_LOADED_URL', action);
            var user = action.payload;
            _usersByUrl[user.attributes.profileUrl] = user.uuid;
            _users.set(user.uuid, user);
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
