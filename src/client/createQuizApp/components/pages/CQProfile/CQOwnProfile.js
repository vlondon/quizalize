/* @flow */
import React, {PropTypes} from 'react';
import CQProfileView from './CQProfileView';
import MeStore from './../../../stores/MeStore';
import TransactionActions from './../../../actions/TransactionActions';

type Props = {
    routeParams: {
        quizCode?: string;
    }
};

type State = {
    profile: Object;
    apps: Array<Object>;
}

class CQOwnProfile extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);

        this.state = {
            profile: MeStore.state,
            apps: []
        };


        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
    }

    componentDidMount() {
        MeStore.addChangeListener(this.onChange);
        if (this.props.routeParams.quizCode !== undefined) {
            TransactionActions.getSharedQuiz(this.props.routeParams.quizCode);
        }

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
        if (MeStore.getUuid()){

            return (
                <CQProfileView
                    {...this.props}
                    profile={MeStore.state}
                    apps={MeStore.apps}
                    own={true}
                />
            );
        } else {
            return (<div/>);
        }
    }

}
CQOwnProfile.propTypes = {
    routeParams: PropTypes.object
};

export default CQOwnProfile;
