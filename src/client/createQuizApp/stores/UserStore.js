/* @flow */
import {Map} from 'immutable';
import Store from './Store';
import AppStore from './AppStore';


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


    isLoggedIn() {
        console.error('UserStore.isLoggedIn() is deprecated');
        return;
    }


    getPublicUser(userId: string): Object{
        var user = _users.get(userId);
        if (user === undefined){
            UserActions.getPublicUser(userId);
            _users = _users.set(userId, null);
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

var fillApps = (apps, quizzes, user)=>{
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
            name: `${user.name} Quizzes`,
            description: ''
        }
    });

    apps.push(appPlaceholder);
    return apps;
};

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    // var text;
    switch(action.actionType) {

        case UserConstants.USER_LOGIN_ERROR:

            break;

        case UserConstants.USER_PUBLIC_LOADED:
            var user = action.payload;
            var apps = fillApps(user.apps, user.quizzes, user);
            user = {...user, apps};
            _users = _users.set(user.uuid, user);

            // _users = _users.set(user.uuid, user);
            userStore.emitChange();
            break;

        case UserConstants.USER_PUBLIC_LOADED_URL:

            var user = action.payload;
            var apps = fillApps(user.apps, user.quizzes, user);
            user = {...user, apps};
            _usersByUrl[user.attributes.profileUrl] = user.uuid;
            _users = _users.set(user.uuid, user);
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
