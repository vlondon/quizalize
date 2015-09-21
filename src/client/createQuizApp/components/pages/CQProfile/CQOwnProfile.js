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
        console.log('MeStore', MeStore.state);


        // UserActions.getOwn().then((profile)=>{
        //     console.log('we got ', profile);
        //     this.setState(this.getState(profile));
        // });


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

            return (
                <CQProfileView
                    profile={this.state.profile}
                    apps={this.state.profile.apps}
                    quizzes={this.state.profile.quizzes}
                    own={true}
                />
            );
        } else {
            return (<div/>);
        }
    }

}

export default CQOwnProfile;
