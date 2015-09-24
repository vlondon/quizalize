/* @flow */
import Store from './Store';
import {Record} from 'immutable';
import AppDispatcher from './../dispatcher/CQDispatcher';
import UserConstants from './../constants/UserConstants';
import type {UserType} from './../../../types/UserType';
import AppStore from './AppStore';

var intercom = require('./../utils/intercom');

var intercomId = window.intercomId;
var intercomAdded = false;



let userAttributes = {
    school: undefined,
    url: undefined,
    profileUrl: undefined,
    bannerUrl: undefined,
    location: undefined,
    ageTaught: undefined,
    subjectTaught: undefined
};
const meAttributesRecord = Record(userAttributes);

let noUser:UserType = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: new meAttributesRecord(),
    created: Date.now()
};

const meRecord = Record(noUser);

class Me extends Store {

    state: UserType;
    apps: Array<Object>;

    constructor(state: UserType = noUser){
        super(state);
        state.attributes = new meAttributesRecord(state.attributes);
        this.state = new meRecord(state);
        this.apps = state.apps || [];
    }

    getState (): UserType {
        return this.state;
    }

    setState(userData : Object) {
        console.log('userDatauserDatauserDatauserDatauserData', userData, typeof userData);
        var fillApps = (apps, quizzes)=>{
            var quizzesWithoutApps = quizzes.filter(q=>{
                var isInApp = apps.filter(a=>{
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
        var quizzes = userData.quizzes || [];
        var apps = userData.apps || [];


        userData.attributes = new meAttributesRecord(userData.attributes);
        // userData = userData.set('attributes', attributes);
        this.state = new meRecord(userData);
        this.apps = fillApps(apps, quizzes);
        this.emitChange();
    }

    isLoggedIn() : boolean {
        var state = this.state;
        return (state.uuid !== '-1') ? true : false;
    }

    getUuid(){
        return this.state.uuid !== '-1' ? this.state.uuid : undefined;
    }



    toJSON(){

        // console.log('state', state.toJSON(), this.state.toJSON());

    }

    addIntercom(){

        var currentUser = this.state;

        if (this.isLoggedIn()){
            window.intercomSettings = {
                name: (currentUser.name || currentUser.email),
                email: (currentUser.email),
                created_at: Math.round((currentUser.created / 1000)),
                app_id: intercomId
            };

            if (intercomAdded === false){
                intercom('boot', window.intercomSettings);
            }

            intercom('update', window.intercomSettings);

            intercomAdded = true;
        } else {
            window.intercomSettings = {
                app_id: intercomId
            };
        }


    }

    getUserId() : string{
        return this.state.uuid;
    }

    emitChange(){
        super.emitChange();
        this.addIntercom();
    }


    isAdmin(): boolean {
        var admins = ['Quizalize Team', 'BlaiZzish', 'Zzish', 'FrancescoZzish', 'SamirZish', 'CharlesZzish'];
        if (this.state && this.state.name){
            return admins.indexOf(this.state.name) !== -1;
        } else {
            return false;
        }
    }
}


var meStore = new Me(window._state);
export default meStore;

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case UserConstants.USER_OWN_LOADED:
        case UserConstants.USER_IS_LOGGED:
        case UserConstants.USER_REGISTERED:
        case UserConstants.USER_DETAILS_UPDATED:
        case UserConstants.USER_PROFILE_UPDATED:


            meStore.setState(action.payload);
            break;
    };
});
