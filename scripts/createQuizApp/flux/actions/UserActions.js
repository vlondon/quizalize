var AppDispatcher       = require('createQuizApp/flux/dispatcher/CQDispatcher');
var UserConstants       = require('createQuizApp/flux/constants/UserConstants');
var UserApi             = require('createQuizApp/flux/actions/api/UserApi');


var UserActions = {

    request: function() {
        UserApi.get()
            .then(function(user){
                AppDispatcher.dispatch({
                    actionType: UserConstants.USER_IS_LOGGED,
                    payload: user
                });
            })
            .catch(function(error){
                console.trace('error: ', error);
                // AnalyticsActions.sendEvent('user', 'USER_IS_NOT_LOGGED');
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
        UserApi.login(data)
            .then(function(user){
                AppDispatcher.dispatch({
                    actionType: UserConstants.USER_IS_LOGGED,
                    payload: user
                });
            })
            .catch(function(error){
                console.trace('error: ', error);

                AppDispatcher.dispatch({
                    actionType: UserConstants.USER_IS_NOT_LOGGED,
                    payload: false
                });
            });

        AppDispatcher.dispatch({
            actionType: UserConstants.USER_LOGIN_REQUEST
        });
    }
};

console.log('UserActions???', UserActions.login);

module.exports = UserActions;
