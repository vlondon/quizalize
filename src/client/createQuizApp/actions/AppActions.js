/* @flow */
// import type App from './../stores/AppStore';

var uuid                = require('node-uuid');

var router              = require('./../config/router');
var debounce            = require('./../utils/debounce');

var AppDispatcher       = require('./../dispatcher/CQDispatcher');
var AppApi              = require('./../actions/api/AppApi');
var QuizApi             = require('./../actions/api/QuizApi');
var AppConstants        = require('./../constants/AppConstants');
var UserApi             = require('./../actions/api/UserApi');
import AnalyticsActions from './../actions/AnalyticsActions';

let searching = false;

var AppActions = {

    isSearching: function() : boolean{
        return searching;
    },

    loadApps: function(){
        AppApi.get()
            .then(function(apps){
                AppDispatcher.dispatch({
                    actionType: AppConstants.APP_LIST_LOADED,
                    payload: apps
                });
            });
    },

    loadApp: function(appId:string){

        if (appId) {
            AppApi.getInfo(appId)
                .then(function(appInfo){
                    AppDispatcher.dispatch({
                        actionType: AppConstants.APP_INFO_LOADED,
                        payload: appInfo
                    });
                });
        }
    },

    deleteApp: function(app:Object){
        AppApi.delete(app)
            .then(()=> this.loadApps() );
    },

    saveNewApp: function(app:Object, appIcon:?Object) : Promise {
        if (!app.uuid) {
            app.uuid = uuid.v4();
            AnalyticsActions.sendEvent('app', 'new', app.meta.name);
            AnalyticsActions.sendIntercomEvent('new_app', {uuid: app.uuid, name: app.meta.name});
        }
        var handleSave = function(icon){
            return new Promise(function(resolve, reject){

                if (icon) {
                    app.meta.iconURL = icon;
                }
                AppApi.putApp(app)
                    .then(function(){
                        AppDispatcher.dispatch({
                            actionType: AppConstants.APP_CREATED,
                            payload: app
                        });
                        router.setRoute(`/quiz/apps`);
                    })
                    .catch(reject);
            });
        };

        if (appIcon){
            return new Promise((resolve, reject) => {
                // this double conditional is to prevent flow complaining
                // about appIcon being undefined
                if (appIcon){
                    this.appPicture(app.uuid, appIcon)
                        .then(function(response){
                            console.log('we got image uploaded?', response);
                            return handleSave(response);
                        })
                        .then(resolve)
                        .catch(reject);

                    }
                });
        } else {
            return handleSave();
        }
    },

    publishApp: function(app:Object) {
        AnalyticsActions.sendEvent('app', 'publish', app.meta.name);
        AnalyticsActions.sendIntercomEvent('publish_app', {uuid: app.uuid, name: app.meta.name});
        app.meta.published = "pending";
        AppApi.publishApp(app);
        AppDispatcher.dispatch({
            actionType: AppConstants.APP_META_UPDATED,
            payload: app
        });

    },

    appPicture: function(appId:string, file:Object){
        return AppApi.uploadMedia(appId, file);
    },

    searchPublicApps: debounce((searchString = '', categoryId = '', profileId) => {
        searching = true;
        AppDispatcher.dispatch({
            actionType: AppConstants.APP_SEARCH_LOADED,
            payload: []
        });

        QuizApi.searchQuizzes(searchString, categoryId, profileId)
            .then(function(quizzes){

            AppApi.searchApps('', '')
                .then(function(apps){

                    var sapps = apps.filter(app => {
                        var found = false;
                        if (typeof app.meta.quizzes !== 'string'){
                            console.warn('problem with the app', app);
                        }
                        quizzes.forEach(quiz => {
                            if (typeof app.meta.quizzes === 'string' && app.meta.quizzes.indexOf(quiz.uuid) >= 0) {
                                if (!found) found = true;
                            }
                            else if (typeof app.meta.quizzes === 'object') {
                                if (!found) found = app.meta.quizzes.filter(function(q) { return q == quiz.uuid; }).length > 0;
                            }
                        });
                        var checkSearch = searchString.length !== 0 ? app.meta.name.toLowerCase().indexOf(searchString.toLowerCase()) > 0 : false;
                        return app.meta.published === "published" && (found || checkSearch);
                    });


                    // apps = apps.filter(function(app) {
                    //     console.log("Going through app",app);
                    //     return false;
                    // });
                    searching = false;
                    AppDispatcher.dispatch({
                        actionType: AppConstants.APP_SEARCH_LOADED,
                        payload: sapps
                    });

                });

            });

    }, 300)


};

module.exports = AppActions;
