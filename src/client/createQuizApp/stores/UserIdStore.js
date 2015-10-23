/* @flow */
if (typeof window !== 'undefined'){
    var _userId:string = window._state.uuid;
}

class UserIdStore {
    setUserId(userId:string) : string{
        _userId = userId;
        return _userId;
    }

    getUserId() : string {
        return _userId;
    }
}

var userIdStore = new UserIdStore();
export default userIdStore;
