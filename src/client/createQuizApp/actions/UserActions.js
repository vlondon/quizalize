/* @flow */
import AppDispatcher from './../dispatcher/CQDispatcher';
import { UserConstants } from './../constants';
import { UserApi } from './../actions/api';
import { urlParams } from './../utils';

import { AnalyticsActions } from './../actions';
import { router } from './../config';
import { intercom } from './../utils';

type loginObject = {
    email: string;
    password: string;
};

var handleRedirect = function(){
    var params = urlParams();
    if (params.redirect){
        router.setRoute(window.decodeURIComponent(params.redirect));
        return true;
    } else {
        return false;
        // router.setRoute(settings.defaultLoggedPage);
    }
};


var UserActions = {

    getOwn: function() : Promise {
        return new Promise((resolve, reject)=>{

            UserApi.getOwn().then( user => {
                let createdDifference = Date.now() - user.created;
                console.log('createdDifference', createdDifference);

                AppDispatcher.dispatch({
                    actionType: UserConstants.USER_OWN_LOADED,
                    payload: user
                });

                resolve(user);

            }).catch(reject);

        });

    },

    discoveryPromotion: function(){
        return UserApi.discoveryPromotion();
    },

    update: function(user: Object) : Promise{

        return new Promise((resolve, reject)=>{

            UserApi.post(user)
                .then(()=>{
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_DETAILS_UPDATED,
                        payload: user
                    });
                    this.getOwn();
                    if (handleRedirect() === false){
                        resolve(user);
                    }
                })
                .catch(reject);
        });
    },


    login: function(data: loginObject): Promise {
        // data.email = data.email.trim();
        return new Promise((resolve, reject)=>{

            UserApi.login(data)
                .then((user)=>{
                    // ;
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_IS_LOGGED,
                        payload: user
                    });
                    this.getOwn();
                    if (handleRedirect() === false){
                        resolve(user);
                    }
                })
                .catch(function(error){
                    reject(error);
                    router.setRoute("/quiz/login");

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

    loginWithToken: function(token: string): Promise {
        return new Promise((resolve, reject)=>{

            UserApi.loginWithToken(token)
                .then((user)=>{
                    // AnalyticsActions.triggerPixels();
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_IS_LOGGED,
                        payload: user
                    });
                    this.getOwn();
                    if (handleRedirect() === false){
                        resolve(user);
                    }
                })
                .catch(function(error){
                    location.href = "/quiz/login";
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_LOGIN_ERROR,
                        payload: error
                    });
                    reject(error);
                });

            AppDispatcher.dispatch({
                actionType: UserConstants.USER_LOGIN_REQUEST
            });
        });
    },

    logout: function(){

        var logoutEnd = function(){

            intercom('shutdown');

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
            window.Zzish.logout(token, function(){
                UserApi.logout().then(logoutEnd);
            });
        } else {
            UserApi.logout().then(logoutEnd);
            // logoutEnd();
        }

    },

    register: function(data: Object) : Promise {

        return new Promise((resolve, reject)=>{

            UserApi.register(data)
                .then((user)=>{

                    this.getOwn();
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

    recover: function(email: string) : Promise {
        return new Promise(function(resolve, reject){
            UserApi.recover(email)
                .then(resolve)
                .catch(reject);
        });
    },

    reset: function(code:string, newPassword: string) : Promise {
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

    search: function(attributes : Object) : Promise {
        return new Promise(function(resolve, reject){
            UserApi.search(attributes)
                .then(function(users){
                    resolve(users);
                })
                .catch(reject);
        });
    },

    getPublicUser: function(userId: string) : Promise{
        return new Promise(function(resolve, reject){
            UserApi.getPublic(userId)
                .then(function(user){
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_PUBLIC_LOADED,
                        payload: user
                    });
                    resolve(user);
                })
                .catch(reject);
        });

    },

    getPublicUserByUrl: function(url: string) : Promise {
        return new Promise(function(resolve, reject){
            UserApi.getPublic(url, 'name')
                .then(function(user){
                    AppDispatcher.dispatch({
                        actionType: UserConstants.USER_PUBLIC_LOADED_URL,
                        payload: user
                    });
                    resolve(user);

                })
                .catch(reject);
        });
    },

    setLoginEmail: function(email: string){
        AppDispatcher.dispatch({
            actionType: UserConstants.USER_LOGIN_EMAIL_ADDED,
            payload: email
        });
    }

};

module.exports = UserActions;
