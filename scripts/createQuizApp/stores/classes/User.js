import {Record} from 'immutable';

var noUser = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: {},
    created: Date.now()
};

class UserDetails extends Record(noUser) {

    constructor(state){
        super(state);
        console.log('building user', state);
    }

}

export default UserDetails;
