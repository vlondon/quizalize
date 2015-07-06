/* @flow */
import Store from './Store';
import UserStore from './UserStore';
var AppDispatcher = require('./../dispatcher/CQDispatcher');
var AppConstants = require('./../constants/AppConstants');
var AppActions = require('./../actions/AppActions');


type AppMeta = {
    code?: string;
    colour: string;
    created: number;
    description: string;
    iconURL: ?string;
    name: string;
    price: number;
    profileId: string;
    quizzes: string;
    updated: number;
}

type AppPayload = {
    quizzes: Array<string>;
}

export type App = {
    uuid?: string;
    meta: AppMeta;
    payload?: AppPayload;
}


var _publicApps: ?Array<App>;
var _apps: Array<App> = [];
var _appInfo = {};

var storeInit = false;
var storeInitPublic = false;


var AppObject = function():App{
    var app = {
        meta: {
            colour: '#a204c3',
            created: Date.now(),
            description: '',
            iconURL: undefined,
            name: '',
            price: 0,
            profileId: UserStore.getUser().uuid,
            quizzes: '',
            updated: Date.now()
        },
        payload: undefined

    };

    return app;
};

class AppStore extends Store {

    getApps() {
        return _apps;
    }

    getAppById(appId) {
        var result = _apps.filter(t => t.uuid === appId);
        return result.length === 1 ? result.slice()[0] : undefined;
    }

    getPublicApps() {
        return _publicApps;
    }

    getAppInfo(appId){
        if (_appInfo[appId] === undefined){
            AppActions.loadApp(appId);
            _appInfo[appId] = {};
        }
        return _appInfo[appId];
    }

    getNewApp():App{
        return new AppObject();
    }


    addChangeListener (callback) {
        if (!storeInit) {
            AppActions.loadApps();
            storeInit = true;
        }
        if (!storeInitPublic) {
            AppActions.searchPublicApps();
            storeInitPublic = true;
        }
        super.addChangeListener(callback);
    }


}

var appStoreInstance = new AppStore();

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    // var text;

    switch(action.actionType) {
        case AppConstants.APP_CREATED:
            _apps.push(action.payload);
            appStoreInstance.emitChange();
            break;


        case AppConstants.APP_LIST_LOADED:
            _apps = action.payload;
            appStoreInstance.emitChange();
            break;

        case AppConstants.APP_SEARCH_LOADED:
            _publicApps = action.payload;
            _publicApps.forEach(function(app){
                if (app.meta.quizzes) {
                    app.meta.quizzes = app.meta.quizzes.split(',');
                }
            });
            appStoreInstance.emitChange();
            break;

        case AppConstants.APP_INFO_LOADED:
            _appInfo[action.payload.uuid] = action.payload;
            appStoreInstance.emitChange();
            break;

        default:
            // no op
    }
});

module.exports = appStoreInstance;
