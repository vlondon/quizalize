var AppDispatcher = require('createQuizApp/flux/dispatcher/CQDispatcher');
var UserConstants = require('createQuizApp/flux/constants/UserConstants');
// var UserActions = require('../actions/UserActions');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';

var _user;


var UserStore = assign({}, EventEmitter.prototype, {

    getUser: function() {
        return _user;
    },


    emitChange: function() {
        console.log('emitting');
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        console.log('adding listener');
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
    console.log('we got action', action);
    switch(action.actionType) {
        case UserConstants.USER_DETAILS:
            console.log('we got action yah!', action);
            _user = action.payload;
            UserStore.emitChange();
            break;
        //
        // case UserConstants.USER_IS_LOGGED:
        // case UserConstants.USER_PROFILE_UPDATED:
        //     _user = action.payload;
        //     UserStore.emitChange();
        //     break;
        //
        //
        // case UserConstants.USER_IS_NOT_LOGGED:
        //     _user = false;
        //     UserStore.emitChange();
        //     break;
        //
        // case UserConstants.USER_LOGIN_ERROR:
        //     console.log('we got USER_LOGIN_ERROR', action);
        //     _error = action.payload;
        //     UserStore.emitChange();
        //     break;



        default:
            // no op
    }
});

module.exports = UserStore;
