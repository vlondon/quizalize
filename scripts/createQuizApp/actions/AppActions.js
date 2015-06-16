var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');

var AppApi              = require('createQuizApp/actions/api/AppApi');
var AppConstants        = require('createQuizApp/constants/AppConstants');
var Promise             = require('es6-promise').Promise;
var uuid                = require('node-uuid');

var debounce            = require('createQuizApp/utils/debounce');

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

    saveNewApp: function(app, appIcon){
        console.log('about to save', app, appIcon);

        app.uuid = app.uuid || uuid.v4();

        var handleSave = function(icon){
            return new Promise(function(resolve, reject){

                if (icon) {
                    app.meta.iconURL = icon;
                }
                console.log('saving', app);
                AppApi.putApp(app)
                    .then(function(){
                        console.log('app saved');
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

    appPicture: function(appId, file){
        return AppApi.uploadMedia(appId, file);
    },

    searchApps: debounce((searchString = '', categoryId) => {

        AppApi.searchApps(searchString, categoryId)
            .then(function(apps){

                AppDispatcher.dispatch({
                    actionType: AppConstants.APP_SEARCH_LOADED,
                    payload: apps
                });

            });
    }, 300)


};

module.exports = AppActions;
