var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var UserConstants       = require('createQuizApp/constants/UserConstants');
var UserApi             = require('createQuizApp/actions/api/UserApi');
var urlParams           = require('createQuizApp/utils/urlParams');

var Promise = require('es6-promise').Promise;

var UserActions = {

    request: function() {

        UserApi.get()
            .then(function(user){
                AppDispatcher.dispatch({
                    actionType: UserConstants.USER_IS_LOGGED,
                    payload: user
                });
            })
            .catch(function(){
                AppDispatcher.dispatch({
                    actionType: UserConstants.USER_IS_NOT_LOGGED,
                    user: false
                });
            });

        AppDispatcher.dispatch({
            actionType: UserConstants.USER_LOGIN_REQUEST
        });
    },


    login: function(data) {
        return new Promise(function(resolve, reject){

            UserApi.login(data)
                .then(function(user){
                    resolve(user);
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_IS_LOGGED,
                        payload: user
                    });
                })
                .catch(function(error){
                    reject(error);
                    console.trace('error: ', error);

                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_LOGIN_ERROR,
                        payload: error
                    });
                });

            AppDispatcher.dispatch({
                actionType: UserConstants.USER_LOGIN_REQUEST
            });
        });
    },

    logout: function(){

        var logoutEnd = function(){
            localStorage.clear();
            AppDispatcher.dispatch({
                actionType: UserConstants.USER_LOGOUT
            });


            var pathArray = location.href.split( '/' );
            var protocol = pathArray[0];
            var host = pathArray[2];
            var url = protocol + '//' + host;
            window.location = url;
        };

        var token = localStorage.getItem('token');

        if (token !== null) {
            console.log('zzish logout');
            Zzish.logout(token, logoutEnd);
        } else {
            logoutEnd();
        }

    },

    register: function(data) {
        return new Promise(function(resolve, reject){

            UserApi.register(data)
                .then(function(user){
                    resolve(user);
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_REGISTERED,
                        payload: user
                    });
                })
                .catch(function(error){
                    reject(error);
                    console.trace('error: ', error);

                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_REGISTER_ERROR,
                        payload: error
                    });
                });


        });
    },

    recover: function(email){
        return new Promise(function(resolve, reject){
            UserApi.recover(email)
                .then(resolve)
                .catch(reject);
        });
    }
};

module.exports = UserActions;
