var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');

var AppApi              = require('createQuizApp/actions/api/AppApi');
var AppConstants        = require('createQuizApp/constants/AppConstants');
var Promise             = require('es6-promise').Promise;
var uuid                = require('node-uuid');


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

    saveNewApp: function(app){
        return new Promise(function(resolve, reject){
            app.uuid = app.uuid || uuid.v4();
            AppApi.putApp(app)
                .then(function(){
                    AppDispatcher.dispatch({
                        actionType: AppConstants.APP_CREATED,
                        payload: app
                    });
                })
                .catch(reject);
        });
    }


};

module.exports = AppActions;
