import React from 'react';

import {
    CQPageTemplate,
} from './../../../components';

import CQRegisterInner from './CQRegisterInner';

class CQRegister extends React.Component {
    render () {
        return (
            <CQPageTemplate className="cq-login">
                <CQRegisterInner/>
            </CQPageTemplate>
        );
    }
}

export default CQRegister;
