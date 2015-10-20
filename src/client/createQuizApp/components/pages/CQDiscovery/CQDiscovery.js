import React from 'react';

import { CQPageTemplate } from './../../../components';
import CQDiscoveryFeatures from './CQDiscoveryFeatures';
import CQDiscoveryQuizalize from './CQDiscoveryQuizalize';

class CQDiscovery extends React.Component {
    render () : any {
        return (
            <CQPageTemplate className='cq-discovery'>

                <div className="cq-discovery__header">
                    <div className="cq-discovery__header__offer">
                        Offer
                    </div>
                    <div className="cq-discovery__header__banner">
                        Get Quizalize Premium <br/>
                        Free for 1 year
                    </div>

                    <p>
                        Our partners Discovery Education are offering a year’s unlimited
                        use of Quizalize Premium completely free for one year.
                        Create and use an unlimited number of quizzes, with unlimited classes,
                        and get access to our advanced data analysis tools.
                    </p>

                    <a href="http://www.zzish.com" className="cq-discovery__header__cta">
                        Take the survey
                        <small>
                            to get Quizalize Premium, free
                        </small>
                    </a>
                </div>

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
                            See all Discovery Education’s Quizalize apps
                        </p>
                    </div>
                </div>

            </CQPageTemplate>
        );
    }
}

export default CQDiscovery;
