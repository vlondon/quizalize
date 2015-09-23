/* @flow */
import Store from './Store';
import {Record} from 'immutable';
import AppDispatcher from './../dispatcher/CQDispatcher';
import UserConstants from './../constants/UserConstants';
import type {UserType} from './../../../types/UserType';
import AppStore from './AppStore';

let noUser:UserType = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: {},
    created: Date.now(),
    quizzes: [],
    apps: []
};

const meRecord = Record(noUser);

class Me extends Store {

    state: UserType;

    constructor(state: UserType = noUser){
        super(state);
        this.state = new meRecord(state);
    }

    getState (): UserType {
        return this.state;
    }

    setState(userData : Object) {

        var fillApps = ()=>{
            var quizzesWithoutApps = userData.quizzes.filter(q=>{
                var isInApp = userData.apps.filter(a=>{
                    var quizzes = a.meta.quizzes || [];
                    return quizzes.filter(aq=> aq.uuid === q.uuid).length !== 0;
                });
                return isInApp.length === 0;
            });

            var appPlaceholder = AppStore.getNewApp({
                uuid: 'own',
                meta: {
                    quizzes: quizzesWithoutApps,
                    colour: '#FFF',
                    name: 'Your Quizzes',
                    description: 'This is a description of your quizzes that don\'t belong to any app'
                }
            });


            apps.push(appPlaceholder);
            return apps;
        };
        var quizzes = userData.quizzes;
        var apps = userData.apps;
        userData.apps = fillApps(apps, quizzes);
        this.state = new meRecord(userData);
        this.emitChange();
    }

    isLoggedIn() : boolean {
        var state = this.state;
        console.log('this sstate', state.uuid);
        return (state.uuid !== '-1') ? true : false;
    }

    setApps(apps : Array<Object>, quizzes : Array<Object>){


    }

    getApps() {

    }

    toJSON(){

    }

}


var meStore = new Me(window._state);
export default meStore;

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case UserConstants.USER_OWN_LOADED:
            // var me = Immutable.fromJS(action.payload);\
            console.log('building me ');
            meStore.setState(action.payload);

            break;
    };
});
