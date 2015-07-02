/* @flow */
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var AppDispatcher = require('./../dispatcher/CQDispatcher');
var AppConstants = require('./../constants/AppConstants');
var AppActions = require('./../actions/AppActions');
var TopicStore = require('./../stores/TopicStore');

type AppMeta = {
    code: string;
    colour: string;
    created: number;
    description: string;
    iconURL: string;
    name: string;
    price: string;
    profileId: string;
    quizzes: string;
    updated: number;
}

type App = {
    uuid: string;
    meta: AppMeta;
}

var CHANGE_EVENT = 'change';

var _publicApps: ?Array<App>;
var _apps: Array<App> = [];
var _appInfo = {};

var storeInit = false;

var AppStore = assign({}, EventEmitter.prototype, {

    getApps: function() {
        return _apps;
    },

    getPublicApps: function() {
        return _publicApps;
    },

    getAppInfo: function(appId){
        if (_appInfo[appId] === undefined){
            AppActions.loadApp(appId);
            _appInfo[appId] = {};
        }
        var appInfo = _appInfo[appId];
        if (appInfo._quizzes){
            appInfo._quizzes = appInfo._quizzes.map(quiz => {
                quiz._category = TopicStore.getTopicById(quiz.meta.categoryId);
                return quiz;
            });
        }
        return _appInfo[appId];
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
        case AppConstants.APP_INFO_LOADED:
            console.log('app loaded', action);
            _appInfo[action.payload.uuid] = action.payload;
            AppStore.emitChange();
            break;
        // case AnalyticsConstants.ANALYTICS_CONVERSION_DISABLED:
        //     _analyticsEnabled = false;
        //     break;



        default:
            // no op
    }
});

module.exports = AppStore;
