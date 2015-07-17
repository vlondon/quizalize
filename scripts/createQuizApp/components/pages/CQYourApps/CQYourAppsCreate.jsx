/* @flow */
import React from 'react';
import router from './../../../config/router';

import AppStore from './../../../stores/AppStore';
import QuizStore from './../../../stores/QuizStore';

import CQViewAppGrid from './../../../components/views/CQViewAppGrid';
import CQViewCreateApp from './../../../components/views/CQViewCreateApp';
import CQLink from './../../../components/utils/CQLink';

type Props = {
    appId: string;
    newApp: boolean;
}

// static propTypes: {appId: string; }
export default class CQYourAppsCreate extends React.Component{

    props: Props;

    constructor(props:Props) {
        super(props);
        this.state = {
            apps: AppStore.getApps()
        };
        this.onChange = this.onChange.bind(this);

    }

    componentWillMount() {
        AppStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);

    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState({
            apps: AppStore.getApps()
        });
    }

    handleApp(app:Object){
        router.setRoute(`/quiz/apps/${app.uuid}`);
    }

    render(): Object {

        var newAppButton = (
            <CQLink href="/quiz/apps/new" className="cq-yourapps__newapp">
                <div className="cq-yourapps__newapp__icon">
                    <i className="fa fa-plus"></i>
                </div>
                Make an app
            </CQLink>
        );

        var numOfQuizzes = QuizStore.getPublicQuizzes().length;

        var edit = this.props.appId ? <CQViewCreateApp appId={this.props.appId}/> : undefined;
        var create = this.props.newApp === true ? <CQViewCreateApp/> : undefined;
        var list = !this.props.newApp && !this.props.appId ? <CQViewAppGrid onClick={this.handleApp} editMode={true} apps={this.state.apps}/> : undefined;
        var newApp = !this.props.newApp && !this.props.appId && numOfQuizzes > 0 ? newAppButton : undefined;

        return (
            <div>
                {newApp}
                {edit}
                {create}
                {list}

                <div className="cq-yourapps__block">
                    <h1 className="cq-yourapps__title">
                        Make apps
                    </h1>
                    <p>
                        Apps are collections of <CQLink href="/quiz/quizzes">your quizzes</CQLink> made by you, which you can promote
                        in the <CQLink href="/quiz/marketplace">Marketplace</CQLink>
                    </p>

                </div>
                <div className="cq-yourapps__subblock">

                    <h3 className="cq-yourapps__title">
                        Set your price
                    </h3>
                    <p>
                        Just like quizzes, you can choose how much to charge other teachers and schools to use your excellent work
                    </p>
                    <h3 className="cq-yourapps__title">
                        Get started now - no coding needed
                    </h3>
                    <p>
                        First <strong><CQLink href="/quiz/quizzes">go here</CQLink></strong> to make some quizzes (you can’t use quizzes made by others), then return here to collect them into one or more apps
                    </p>
                </div>
            </div>
        );
    }

}
CQYourAppsCreate.propTypes = {
    appId: React.PropTypes.string,
    newApp: React.PropTypes.bool
};
