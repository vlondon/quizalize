/* @flow */
import React from 'react';

import {
    CQSettings,
    CQPageTemplate
} from './../../../components';

class CQSettingsPage extends React.Component {
    constructor(props){
        super(props);
    }
    render () {
        return (
            <CQPageTemplate>
                <CQSettings {...this.props}/>
            </CQPageTemplate>
        );
    }
}

export default CQSettingsPage;
