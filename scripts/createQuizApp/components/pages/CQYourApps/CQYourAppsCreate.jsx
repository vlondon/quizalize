/* @flow */
import React from 'react';
import router from './../../../config/router';

import AppStore from './../../../stores/AppStore';

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
        console.log('thissss', this);
        AppStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this.onChange);
    }

    onChange(){
        console.log('this', this);
        this.setState({
            apps: AppStore.getApps()
        });
    }

    handleApp(app:Object){
        console.log('app clicked', app);
        router.setRoute(`/quiz/apps/${app.uuid}`);
    }

    render(): Object {

        var edit = this.props.appId ? <CQViewCreateApp appId={this.props.appId}/> : undefined;
        var create = this.props.newApp === 42 ? <CQViewCreateApp/> : undefined;
        var list = !this.props.newApp && !this.props.appId ? <CQViewAppGrid onClick={this.handleApp} editMode={true} apps={this.state.apps}/> : undefined;
        var newApp = !this.props.newApp && !this.props.appId ? <CQLink href="/quiz/apps/new" className="btn btn-primary"><i className="fa fa-plus"></i> New app</CQLink> : undefined;

        return (
            <div>
                {newApp}
                {edit}
                {create}
                {list}

            </div>
        );
    }

}
CQYourAppsCreate.propTypes = {
    appId: React.PropTypes.string,
    newApp: React.PropTypes.bool
};
