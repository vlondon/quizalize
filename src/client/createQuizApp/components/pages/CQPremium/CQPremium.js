/* @flow */
import React from 'react';

import {
    CQPageTemplate,
    CQSettingsSubscriptions
} from './../../../components';

import { MeStore } from './../../../stores';

type Props = {};

class CQPremium extends React.Component {

    props: Props;

    constructor(props : Props){
        super(props);
        this.onChange = this.onChange.bind(this);
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

    render () {
        return (
            <CQPageTemplate className="cq-container cq-premium">
                <CQSettingsSubscriptions user={MeStore.state}/>
            </CQPageTemplate>
        );
    }
}

export default CQPremium;
