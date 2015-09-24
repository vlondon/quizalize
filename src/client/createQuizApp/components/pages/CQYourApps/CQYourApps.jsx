/* @flow */
import React from 'react';

import MeStore               from '../../../stores/MeStore';
import CQPageTemplate          from '../../CQPageTemplate';
import CQYourAppsCreate        from './CQYourAppsCreate';

type Props = {
    routeParams: {
        appId: string;
    };
}
type State = {
    isAdmin: boolean;
}

export default class CQYourApps extends React.Component {

    state: State;
    props: Props;

    constructor(props:Props) {

        super(props);
        this.state = {
            isAdmin: MeStore.isAdmin()
        };
    }

    render() {
        var newApp = this.props.routeParams.appId === 'new';
        var appId = this.props.routeParams.appId && this.props.routeParams.appId !== 'new' ? this.props.routeParams.appId : undefined;
        return (
            <CQPageTemplate className="cq-container cq-yourapps">
                <h2 className='cq-yourapps__header'>
                    <i className="fa fa-archive"/> Your apps
                </h2>
                <CQYourAppsCreate newApp={newApp} appId={appId}/>
            </CQPageTemplate>
        );
    }

}

CQYourApps.propTypes = {
    newApp: React.PropTypes.bool,
    routeParams: React.PropTypes.Object
};
