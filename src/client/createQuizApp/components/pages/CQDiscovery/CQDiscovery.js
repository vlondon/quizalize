import React from 'react';

import { CQPageTemplate } from './../../../components';
import { CQLink } from './../../../components';
import CQDiscoveryFeatures from './CQDiscoveryFeatures';
import CQDiscoveryQuizalize from './CQDiscoveryQuizalize';
import CQDiscoveryHeader from './CQDiscoveryHeader';


class CQDiscovery extends React.Component {
    render () : any {
        return (
            <CQPageTemplate className='cq-discovery'>

                <CQDiscoveryHeader/>
                <CQDiscoveryFeatures/>
                <CQDiscoveryQuizalize/>

                <div className="cq-discovery__education">
                    <div className="cq-discovery__education__brand">
                        <img src={require('./../../../../assets/cq_discovery__logo.svg')} alt=""/>
                    </div>
                    <div className="cq-discovery__education__copy">

                        <p>
                            Discovery Education is a leading provider of digital content to schools, empowering teachers and captivating students with interactive lessons, real-time assessment and virtual experiences.
                        </p>
                        <p className="cq-discovery__education__cta">
                            <CQLink href="/profile/discovery-educator-network">
                                See all Discovery Education’s Quizalize apps
                            </CQLink>
                        </p>
                    </div>
                </div>

            </CQPageTemplate>
        );
    }
}

export default CQDiscovery;
