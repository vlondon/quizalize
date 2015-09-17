var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var UserConstants       = require('createQuizApp/constants/UserConstants');
var UserApi             = require('createQuizApp/actions/api/UserApi');
var urlParams           = require('createQuizApp/utils/urlParams');
import AnalyticsActions from 'createQuizApp/actions/AnalyticsActions';
import router from './../config/router';
import cookies from './../utils/cookies';
import intercom from './../utils/intercom';

var handleRedirect = function(){
    var params = urlParams();
    if (params.redirect){
        router.setRoute(window.decodeURIComponent(params.redirect));
        return true;
    }
    return false;
};


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

    getOwn: function(){
        return UserApi.getOwn();
    },

    update: function(user){
        return new Promise(function(resolve, reject){

            UserApi.post(user)
                .then(()=>{
                    console.log('about to update user', user);
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_DETAILS_UPDATED,
                        payload: user
                    });
                    if (handleRedirect() === false){
                        resolve(user);
                    }
                })
                .catch(reject);
        });
    },


    login: function(data) {
        return new Promise(function(resolve, reject){

            UserApi.login(data)
                .then(function(user){
                    // AnalyticsActions.triggerPixels();
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_IS_LOGGED,
                        payload: user
                    });
                    if (handleRedirect() === false){
                        resolve(user);
                    }
                })
                .catch(function(error){
                    reject(error);


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

    loginWithToken: function(data) {
        return new Promise(function(resolve, reject){

            UserApi.loginWithToken(data)
                .then(function(user){
                    // AnalyticsActions.triggerPixels();
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_IS_LOGGED,
                        payload: user
                    });
                    if (handleRedirect() === false){
                        resolve(user);
                    }
                })
                .catch(function(error){
                    reject(error);


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
            intercom('shutdown');
            cookies.removeItem('cqUuid');
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
            console.log('registering', data);
            UserApi.register(data)
                .then(function(user){
                    console.log("AnalyticsActions", AnalyticsActions);
                    console.log("AnalyticsActions.triggerPixels", AnalyticsActions.triggerPixels);
                    AnalyticsActions.triggerPixels().then(function(){
                        AppDispatcher.dispatch({
                            actionType: UserConstants.USER_REGISTERED,
                            payload: user
                        });
                        resolve(user);
                        // if (handleRedirect() === false){
                        // }
                    });
                })
                .catch(function(error){
                    reject(error);
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
    },

    reset: function(code, newPassword) {
        return new Promise(function(resolve, reject){
            UserApi.reset(code, newPassword)
                .then(function(user){

                    setTimeout(function(){
                        AppDispatcher.dispatch({
                            actionType: UserConstants.USER_IS_LOGGED,
                            payload: user
                        });
                    }, 3000);

                    resolve(user);
                })
                .catch(reject);
        });
    },

    search: function(attributes) {
        return new Promise(function(resolve, reject){
            UserApi.search(attributes)
                .then(function(users){
                    resolve(users);
                })
                .catch(reject);
        });
    },

    getPublicUser: function(userId, key){
        return new Promise(function(resolve, reject){
            UserApi.getPublic(userId, key)
                .then(function(user){
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_PUBLIC_LOADED,
                        payload: user
                    });
                    console.log('will load', userId, user);
                    resolve(user);
                })
                .catch(reject);
        });

    },

    getPublicUserByUrl: function(url){
        return new Promise(function(resolve, reject){
            UserApi.getPublic(url, 'name')
                .then(function(user){
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_PUBLIC_LOADED_URL,
                        payload: user
                    });
                    console.log('response', user);
                    resolve(user);

                })
                .catch(reject);
        });

    },

    setLoginEmail: function(email){
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_LOGIN_EMAIL_ADDED,
            payload: email
        });
    }

};

module.exports = UserActions;
