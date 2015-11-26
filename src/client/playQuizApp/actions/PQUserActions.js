/* @flow */

import uuid from 'node-uuid';
import AppDispatcher  from './../dispatcher/PQDispatcher';
import UserConstants from './../constants/UserConstants';
import PQUserStore from './../stores/PQUserStore';


class PQUserActions {

    loginUser(name: string, classCode: string) {
        console.log('will log in user', name, classCode);

        // if (window.Zzish.validateClassCode(classCode)) {

        var newId = uuid.v4();
        window.Zzish.authUser(newId, name, classCode, function(err, message) {
            if (!err) {
                console.log('1. authUser success: ', message);
                //registerWithGroup(classCode);
                AppDispatcher.dispatch({
                    type: UserConstants.USER_IS_LOGGED,
                    payload: message
                });
            }
            else {
                console.log('2. authUser error: ', message, err);
                AppDispatcher.dispatch({
                    type: UserConstants.USER_LOGIN_ERROR,
                    payload: message
                });

            }
        });

        // } else {
        //     AppDispatcher.dispatch({
        //         type: UserConstants.USER_LOGIN_ERROR,
        //         payload: "Check your classcode"
        //     });
        // }

    }

}

var pqUserActionsInstance = new PQUserActions();
export default pqUserActionsInstance;
