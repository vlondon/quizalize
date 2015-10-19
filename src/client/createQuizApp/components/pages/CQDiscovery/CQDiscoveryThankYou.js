import React, { PropTypes } from 'react';

import {
    CQPageTemplate,
    CQRegisterInner
} from './../../../components';

import CQDiscoveryFeatures from './CQDiscoveryFeatures';
import CQDiscoveryQuizalize from './CQDiscoveryQuizalize';

class CQDiscoveryThankYou extends React.Component {
    render () {
        let header = (
            <div>
                Sign up or log in and Quizalize Premium <br/>is yours for a year, free.
            </div>
        );
        return (
            <CQPageTemplate className="cq-discovery">

                <div className="cq-discovery__register">
                    <div className="cq-discovery__header__offer">
                        &nbsp;
                    </div>
                    <div className="cq-discovery__header__banner">
                        Get Quizalize Premium <br/>
                        Free for 1 year
                    </div>

                    <CQRegisterInner
                        showZzish={false}
                        header={header}
                    />
                </div>


                <CQDiscoveryFeatures/>
                <CQDiscoveryQuizalize/>
            </CQPageTemplate>
        );
    }
}

export default CQDiscoveryThankYou;
