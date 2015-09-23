/* @flow */
import Store from './Store';
import UserStore from './UserStore';
import App from './classes/App';
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
    quizzes: Array<string>;
    updated: number;
};

type AppPayload = {
    quizzes: Array<string>;
    categories: Array<any>;
};

type AppExtra = {
    author: Object;
    quizzes: Array<Object>;
};

export type AppType = {
    uuid: string;
    meta: AppMeta;
    payload?: AppPayload;
    extra?: AppExtra;
};

export type AppComplete = {
    uuid: ?string;
    meta: AppMeta;
    payload: AppPayload;
};


var _publicApps: ?Array<App>;
var _apps: Array<App> = [];
var _appLoaded = false;

var _appInfo = {};

var storeInit = false;
var storeInitPublic = false;

class Application {

    uuid: ?string;
    meta: AppMeta;
    payload: AppPayload;

    constructor(appInfo: ?AppComplete){
        var user:Object = UserStore.getUser();
        var profileId = user.uuid || undefined;
        var emptyApp = {
            uuid: undefined,
            meta:  {
                colour: '#a204c3',
                created: Date.now(),
                description: '',
                iconURL: undefined,
                name: '',
                price: 0,
                profileId,
                quizzes: [],
                updated: Date.now()
            },
            payload: {
                categories: [],
                quizzes: []
            }
        };

        Object.assign(this, emptyApp, appInfo);


    }

}

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
                    console.log('splitting', app.meta.quizzes);
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
