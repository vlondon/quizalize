/* @flow */
import Store from './Store';

import App from './classes/App';
import AppDispatcher from './../dispatcher/CQDispatcher';
import {AppConstants} from './../constants';
import {AppActions} from './../actions';
import {Application} from './classes/Application';

import type {AppType, AppComplete } from './../../../types';

var _publicApps: ?Array<AppType>;
var _apps: Array<AppType> = [];
var _appLoaded = false;

var _appInfo = {};

var storeInit = false;
var storeInitPublic = false;

var fixAppTypes = function(app: ?App){
    if (app) {
        app.meta.price = Number(app.meta.price);
    }
    return app;
};

class AppStore extends Store {

    getApps() {
        return _apps;
    }

    getAppsLoaded() : boolean {
        return _appLoaded;
    }

    getAppById(appId):?App {
        var result:Array<App> = _apps.filter(t => t.uuid === appId);
        var app : ?App = result.length === 1 ? result.slice()[0] : undefined;
        return fixAppTypes(app);
    }

    getPublicApps() {
        return _publicApps;
    }

    getAppInfo(appId:string): ?AppComplete{
        var app = _appInfo[appId];
        if (app === undefined){
            AppActions.loadApp(appId);
        }
        return app;
        // return fixAppTypes(app);
    }

    getNewApp(appInfo: ?Object): AppComplete {
        return new Application(appInfo);
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
            // _apps.push(action.payload);
            _appInfo[action.payload.uuid] = undefined;
            AppActions.loadApps();
            // appStoreInstance.emitChange();
            break;


        case AppConstants.APP_LIST_LOADED:
            _apps = action.payload.map(app => new App(app));
            console.log('_apps', _apps);
            appStoreInstance.emitChange();
            break;

        case AppConstants.APP_SEARCH_LOADED:
            _publicApps = action.payload;
            _appLoaded = true;
            _publicApps.forEach(function(app){
                if (typeof app.meta.quizzes === 'string') {
                    app.meta.quizzes = app.meta.quizzes.split(',');
                }
            });
            appStoreInstance.emitChange();
            break;

        case AppConstants.APP_INFO_LOADED:
            _appInfo[action.payload.uuid] = action.payload;
            appStoreInstance.emitChange();
            break;

        case AppConstants.APP_META_UPDATED:
            _appInfo[action.payload.uuid] = action.payload;
            appStoreInstance.emitChange();
            break;

        default:
            // no op
    }
});

export default appStoreInstance;
