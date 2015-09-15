/* @flow */
import React from 'react';
import CQProfileView from './CQProfileView';

import AppStore from './../../../stores/AppStore';
import UserActions from './../../../actions/UserActions';



type Props = {};

type State = {
    profile: Object;
    apps: Array<Object>;
    quizzes: Array<Object>;
}

class CQOwnProfile extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = this.getState();

        UserActions.getOwn().then((profile)=>{
            console.log('we got ', profile);
            this.setState(this.getState(profile));
        });

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
    }

    componentDidMount() {
        // QuizStore.addChangeListener(this.onChange);

    }

    componentWillUnmount() {
        // QuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        // this.setState(this.getState());
    }

    getState (profile : Object = {}) : State {
        var apps = profile ? profile.apps : [];
        var quizzes = profile ? profile.quizzes : [];

        return { profile, apps, quizzes };
    }

    render () {
        if (this.state.profile.uuid){
            var quizzesWithoutApps = this.state.quizzes.filter(q=>{
                var isInApp = this.state.apps.filter(a=>{
                    var quizzes = a.meta.quizzes || [];
                    return quizzes.filter(aq=> aq.uuid === q.uuid).length !== 0;
                });
                console.log('quizzesWithoutApps inapp', isInApp);
                return isInApp.length === 0;
            });

            var appPlaceholder:Object = AppStore.getNewApp();
            appPlaceholder.uuid = 'own';
            appPlaceholder.meta.quizzes = quizzesWithoutApps;
            appPlaceholder.meta.colour = '#FFFFFF';
            appPlaceholder.meta.name = 'Your Quizzes';
            appPlaceholder.meta.description = "This is a description of your quizzes that don't belong to any app";

            console.log('quizzesWithoutApps app', appPlaceholder);
            console.log('quizzesWithoutApps', quizzesWithoutApps);
            var apps = this.state.apps;
            apps.push(appPlaceholder);
            return (
                <CQProfileView
                    profile={this.state.profile}
                    apps={this.state.apps}
                    quizzes={this.state.quizzes}
                    own={true}
                />
            );
        } else {
            return (<div/>);
        }
    }

}

export default CQOwnProfile;
