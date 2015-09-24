/* @flow */
import uuid from 'node-uuid';

import type {User} from './../../stores/PQUserStore';

var zzish = window.zzish;

class UserApi {

    getUser(): Promise {
        return new Promise((resolve, reject)=>{
            var userId = localStorage.getItem('pqUuid');
            if (userId) {
                zzish.getUser(userId, undefined, (err, user) => {
                    if (!err) { resolve(user); } else { reject(err); }
                });
            } else {
                reject();
            }
        });
    }

    authUser(userName: string, classCode: string): Promise{
        return new Promise((resolve, reject) => {

            if (zzish.validateClassCode(classCode)) {
                var newId = uuid.v4();

                zzish.authUser(newId, userName, classCode, (err, user) => {

                    if (!err) {
                        this.registerWithGroup(user, classCode)
                            .then(function(){
                                resolve(user);
                            })
                            .catch(reject);
                    } else {
                        reject(err);
                    }
                });

            } else {
                reject();
            }
        });
    }

    registerWithGroup(user: User, classCode: string): Promise {
        return new Promise((resolve, reject)=>{

            console.log('registering', user, classCode);
            zzish.registerUserWithGroup(user.uuid, classCode, function(err, resp) {
                localStorage.setItem('pqClassCode', classCode);
                localStorage.setItem('pqUuid', user.uuid);
                if (!err) {
                    resolve(resp);
                } else {
                    reject(err);
                }


            });
        });
    }


}

var userApiInstance = new UserApi();
export default userApiInstance;
