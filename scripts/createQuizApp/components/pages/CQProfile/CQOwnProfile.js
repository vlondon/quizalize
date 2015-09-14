/* @flow */
import React from 'react';
import CQProfileView from './CQProfileView';

import UserStore from './../../../stores/UserStore';
import UserActions from './../../../actions/UserActions';
import QuizStore from './../../../stores/QuizStore';
import AppStore from './../../../stores/AppStore';

type Props = {};

type State = {
    profile: Object;
    apps: Array<Object>;
    quizzes: Array<Object>;
}

class CQOwnProfile extends React.Component {

    props: Props;

    constructor(props: Props) {
        super(props);
        this.state = {};

        UserActions.getOwn().then((user)=>{
            console.log('we got ', user);
            this.setState({ user });
        });

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);

    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState(this.getState());
    }

    getState () : any {
        // var profile = UserStore.getUser();
        // var apps = AppStore.getApps();
        // var quizzes = QuizStore.getQuizzes();
        // return { profile, apps, quizzes };
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

export default CQOwnProfile;
