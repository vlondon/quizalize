var AppDispatcher = require('createQuizApp/dispatcher/CQDispatcher');
var AppConstants = require('createQuizApp/constants/AppConstants');
var AppActions = require('createQuizApp/actions/AppActions');
// var AnalyticsConstants = require('createQuizApp/constants/AnalyticsConstants');

var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var CHANGE_EVENT = 'change';

var _publicApps = [];
var _apps = [];

var storeInit = false;

var AppStore = assign({}, EventEmitter.prototype, {

    getApps: function() {
        return _apps;
    },

    getPublicApps: function() {
        return _publicApps;
    },

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    /**
     * @param {function} callback
     */
    addChangeListener: function(callback) {
        if (!storeInit) {
            AppActions.loadApps();
            storeInit = true;
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
AppStore.dispatchToken = AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case AppConstants.APP_LIST_LOADED:
            _apps = action.payload;
            AppStore.emitChange();
            break;

        case AppConstants.APP_SEARCH_LOADED:
            _publicApps = action.payload;
            _publicApps.forEach(function(app){
                app.meta.quizzes = app.meta.quizzes.split(',');
            });
            AppStore.emitChange();
            break;
        //
        // case AnalyticsConstants.ANALYTICS_CONVERSION_DISABLED:
        //     _analyticsEnabled = false;
        //     AppStore.emitChange();
        //     break;



        default:
            // no op
    }
});

module.exports = AppStore;
