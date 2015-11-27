/* @flow */
import Store from './Store';
import {Application} from './classes/Application';
import {Record} from 'immutable';
import AppDispatcher from './../dispatcher/CQDispatcher';
import {
    UserConstants,
    QuizConstants
} from './../constants';
import {
    UserActions
} from './../actions';
import type {UserType, Quiz} from './../../../types';


var intercom = require('./../utils/intercom');

var intercomId = window.intercomId;
var intercomAdded = false;

let userAttributes = {
    ageTaught: undefined,
    bannerUrl: undefined,
    imageUrl: undefined,
    location: undefined,
    profileUrl: undefined,
    school: undefined,
    subjectTaught: undefined,
    url: undefined,
    accountType: undefined,
    accountTypeUpdated: undefined,
    accountTypeExpiration: undefined
};

const meAttributesRecord = Record(userAttributes);

let noUser:UserType = {
    uuid: '-1',
    avatar: '',
    email: '',
    name: '',
    attributes: new meAttributesRecord()
};

const meRecord = Record(noUser);

class Me extends Store {

    state: UserType;
    apps: Array<Object>;

    constructor(state: UserType = noUser){
        super(state);

        state = Object.assign({}, state);
        state.attributes = state.attributes || {};
        state.attributes.accountType = state.attributes.accountType !== undefined ? parseInt(state.attributes.accountType, 10) : 1;
        state.attributes = new meAttributesRecord(state.attributes);
        this.state = new meRecord(state);
        this.apps = state.apps || [];
        if (state.uuid) {
            UserActions.getOwn();
        }
    }

    getState (): UserType {
        return this.state;
    }

    setState(userData : Object) {
        var fillApps = (apps, quizzes)=>{
            var quizzesWithoutApps = quizzes.filter(q=>{
                var isInApp = apps.filter(a=>{
                    var quizzes = a.meta.quizzes || [];
                    return quizzes.filter(aq=> aq.uuid === q.uuid).length !== 0;
                });
                return isInApp.length === 0;
            });

            var appPlaceholder = new Application({
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
        if (currentUser.attributes.accountType !== -10){

            if (this.isLoggedIn()){
                window.intercomSettings = {
                    name: (currentUser.name || currentUser.email),
                    email: (currentUser.email),
                    user_id: currentUser.uuid,
                    created_at: Math.round((currentUser.created / 1000)),
                    app_id: intercomId
                };
            } else {
                window.intercomSettings = {
                    app_id: intercomId
                };
            }
            window.intercomSettings.widget = {
                activator: "#IntercomDefaultWidget"
            };
            if (intercomAdded === false){
                intercom('boot', window.intercomSettings);
            }
            intercom('update', window.intercomSettings);
            intercomAdded = true;
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

    isPremium() : boolean {
        return this.state.attributes.accountType !== 0;
    }

    updateQuiz(quiz: Quiz) {
        let changed = false;
        this.apps.forEach(app=>{
            app.meta.quizzes = app.meta.quizzes.map(q=>{
                if (q.uuid === quiz.uuid){
                    q = quiz;
                    changed = true;
                }
                return q;
            });
        });
        if (!changed) {
            this.apps.forEach(app=>{
                if (app.uuid === 'own') {
                    app.meta.quizzes.push(quiz);
                }
            });
        }
        super.emitChange();
    }
}


var meStore = new Me(window._state);
export default meStore;

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    console.info('ACTION:', action.actionType, action);
    switch(action.actionType) {
        case UserConstants.USER_OWN_LOADED:
        case UserConstants.USER_IS_LOGGED:
        case UserConstants.USER_REGISTERED:
        case UserConstants.USER_DETAILS_UPDATED:
        case UserConstants.USER_PROFILE_UPDATED:


            meStore.setState(action.payload);
            break;

        case QuizConstants.QUIZ_ADDED:
            // UserActions.getOwn();
            let quiz = action.payload;
            meStore.updateQuiz(quiz);
            break;
    };
});
