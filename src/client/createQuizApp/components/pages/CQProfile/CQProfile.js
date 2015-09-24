/* @flow */
import React from 'react';
import CQProfileView from './CQProfileView';

import UserStore from './../../../stores/UserStore';

type Props = {
    routeParams: { profileId: string; }
}
type State = {
    profile: Object;
    apps: Array<Object>;
    quizzes: Array<Object>;
}

class CQProfile extends React.Component {

    props: Props;

    constructor(props: Props) {
        super(props);
        this.state = this.getState();

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
    }

    componentDidMount() {
        UserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        UserStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState(this.getState());
    }

    getState (props: ?Props) : State {
        props = props || this.props;

        var profileId = props.routeParams.profileId;

        var profile = UserStore.getPublicUser(profileId);
        var apps = profile ? profile.apps : [];
        var quizzes = profile ? profile.quizzes : [];


        return { profile, apps, quizzes };
    }

    render () {
        return (
            <CQProfileView
                profile={this.state.profile}
                apps={this.state.apps}
                quizzes={this.state.quizzes}
            />
        );
    }

}

export default CQProfile;
