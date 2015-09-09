/* @flow */
import cookies from './../utils/cookies';
var _userId: string = cookies.getItem('cqUuid');;

class UserIdStore {
    setUserId(userId:string) : string{
        _userId = userId;
        return _userId;
    }

    getUserId() : string{
        return _userId;
    }
}

var userIdStore = new UserIdStore();
export default userIdStore;
