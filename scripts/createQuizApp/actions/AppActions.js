/* @flow */
import type App from './../stores/AppStore';

var Promise             = require('es6-promise').Promise;
var uuid                = require('node-uuid');
var AppDispatcher       = require('./../dispatcher/CQDispatcher');
var AppApi              = require('./../actions/api/AppApi');
var QuizApi             = require('./../actions/api/QuizApi');
var AppConstants        = require('./../constants/AppConstants');

var debounce            = require('./../utils/debounce');

var AppActions = {

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
        AppApi.getInfo(appId)
            .then(function(appInfo){
                AppDispatcher.dispatch({
                    actionType: AppConstants.APP_INFO_LOADED,
                    payload: appInfo
                });
            });
    },

    deleteApp: function(app:App){
        AppApi.delete(app)
            .then(()=> this.loadApps() );
    },

    saveNewApp: function(app:App, appIcon:Object){


        app.uuid = app.uuid || uuid.v4();

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
                    })
                    .catch(reject);
            });
        };

        if (appIcon !== undefined){
            return new Promise((resolve, reject) => {
                this.appPicture(app.uuid, appIcon)
                    .then(function(response){
                        console.log('we got image uploaded?', response);
                        return handleSave(response);
                    })
                    .then(resolve)
                    .catch(reject);

                });
        } else {
            return handleSave();
        }
    },

    appPicture: function(appId:string, file:Object){
        return AppApi.uploadMedia(appId, file);
    },

    searchPublicApps: debounce((searchString = '', categoryId, profileId) => {

        QuizApi.searchQuizzes(searchString, categoryId, profileId)
            .then(function(quizzes){

            AppApi.searchApps('', '')
                .then(function(apps){

                    apps = apps.filter(app => {
                        var found = false;
                        quizzes.forEach(quiz => {
                            if (app.meta.quizzes.indexOf(quiz.uuid) >= 0) {
                                found = true;
                            }
                        });
                        return found;
                    });


                    // apps = apps.filter(function(app) {
                    //     console.log("Going through app",app);
                    //     return false;
                    // });

                    AppDispatcher.dispatch({
                        actionType: AppConstants.APP_SEARCH_LOADED,
                        payload: apps
                    });

                });

            });

    }, 300)


};

module.exports = AppActions;
