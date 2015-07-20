/* @flow */
import AppDispatcher  from './../dispatcher/PQDispatcher';
import PQUserConstants from './../constants/PQUserConstants';

import UserApi from './api/PQUserApi';


class PQUserActions {

    getUser () {
        UserApi.getUser()
            .then((user)=>{
                AppDispatcher.dispatch({
                    type: PQUserConstants.USER_IS_LOGGED,
                    payload: user
                });
            })
            .catch(()=>{
                AppDispatcher.dispatch({
                    type: PQUserConstants.USER_IS_NOT_LOGGED
                });
            });
    }

    loginUser (userName: string, classCode: string){

        UserApi.authUser(userName, classCode)
            .then(user => {
                AppDispatcher.dispatch({
                    type: PQUserConstants.USER_LOGIN_SUCESS,
                    payload: user
                });
            });
    }
}

var pqUserActionsInstance = new PQUserActions();
export default pqUserActionsInstance;
