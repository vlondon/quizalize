/* @flow */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');
var AppDispatcher = require('./../dispatcher/CQDispatcher');
var UserConstants = require('./../constants/UserConstants');
var UserActions = require('./../actions/UserActions');


var CHANGE_EVENT = 'change';

var storeInit = false;
var _user: Object = {};
var _users = {};

var UserStore = assign({}, EventEmitter.prototype, {

    getUser: function() {
        return _user;
    },


    getPublicUser: function(userId){
        var user = _users[userId];
        if (user === undefined){
            UserActions.getPublicUser(userId);
            _users[userId] = null;
        }
        console.log('retrieving user iid', userId, user);
        return user;
    },

    isAdmin: function(): number {
        console.log('_user', _user);
        var admins = ['Quizalize Team', 'BlaiZzish', 'Zzish', 'FrancescoZzish', 'SamirZish', 'CharlesZzish'];
        return admins.indexOf(_user.name);
    },


    putUser: function(){

    },


    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (!storeInit){
            storeInit = true;
            UserActions.request();
        }
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
AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case UserConstants.USER_DETAILS:
        case UserConstants.USER_DETAILS_UPDATED:
        case UserConstants.USER_IS_LOGGED:
        case UserConstants.USER_PROFILE_UPDATED:
        case UserConstants.USER_REGISTERED:
            _user = action.payload;
            UserStore.emitChange();
            break;
        //
        //
        case UserConstants.USER_IS_NOT_LOGGED:
        case UserConstants.USER_LOGOUT:
            _user = {};
            UserStore.emitChange();
            break;
        //
        case UserConstants.USER_LOGIN_ERROR:
            console.log('we got USER_LOGIN_ERROR', action);
            // _user = false;
            // UserStore.emitChange();
            break;

        case UserConstants.USER_PUBLIC_LOADED:
            console.log('UserConstants.USER_PUBLIC_LOADED', action);
            var user = action.payload;
            _users[user.uuid] = user;
            UserStore.emitChange();
            break;



        default:
            // no op
    }
});

module.exports = UserStore;
