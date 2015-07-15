/* @flow */
import React from 'react';

import UserStore               from '../../../stores/UserStore';
import CQPageTemplate          from '../../CQPageTemplate';
import CQYourAppsCreate        from './CQYourAppsCreate';

type Props = {
    newApp: boolean;
    appId: string;
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
            isAdmin: UserStore.isAdmin()
        };
    }

    render() {

        return (
            <CQPageTemplate className="cq-container cq-yourapps">
                <h2 className='cq-yourapps__header'>
                    <i className="fa fa-archive"/> Your apps
                </h2>
                <CQYourAppsCreate newApp={this.props.newApp} appId={this.props.appId}/>
            </CQPageTemplate>
        );
    }

}

CQYourApps.propTypes = {
    newApp: React.PropTypes.bool,
    appId: React.PropTypes.string
};
