/* @flow */
import React from 'react';
import CQProfileView from './CQProfileView';

import AppStore from './../../../stores/AppStore';
import MeStore from './../../../stores/MeStore';
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
        this.state = {
            profile: MeStore.state,
            apps: [],
            quizzes: []
        };



        UserActions.getOwn();


        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
    }

    componentDidMount() {
        MeStore.addChangeListener(this.onChange);

    }

    componentWillUnmount() {
        MeStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.forceUpdate();
    }

    getState (profile : Object = {}) : State {
        var apps = profile ? profile.apps : [];
        var quizzes = profile ? profile.quizzes : [];

        return { profile, apps, quizzes };
    }

    render () {
        if (MeStore.state.uuid){

            return (
                <CQProfileView
                    profile={MeStore.state}
                    apps={MeStore.state.apps}
                    quizzes={MeStore.state.quizzes}
                    own={true}
                />
            );
        } else {
            return (<div/>);
        }
    }

}

export default CQOwnProfile;
