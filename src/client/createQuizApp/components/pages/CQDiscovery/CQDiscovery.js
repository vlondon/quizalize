import React from 'react';

import { CQPageTemplate } from './../../../components';


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

                <div className="cq-discovery__features">
                    <h1 className="cq-discovery__features__header">With Quizalize Premium, you can:</h1>
                    <ul className="cq-discovery__features__list">
                        <li>
                            <div className="cq-discovery__features__list__icon">
                                <img src={require('./../../../../assets/cq-discovery__unlimited.svg')} alt=""/>
                            </div>
                            <h3>Create and use an unlimited number of quizzes</h3>
                            <p>and keep them private or publish them.</p>
                        </li>
                        <li>
                            <div className="cq-discovery__features__list__icon">
                                <img src={require('./../../../../assets/cq-discovery__user.svg')} alt=""/>
                            </div>
                            <h3>Use Quizalize with every class you teach</h3>
                            <p>saving hours of planning and marking.</p>
                        </li>
                        <li>
                            <div className="cq-discovery__features__list__icon">
                                <img src={require('./../../../../assets/cq-discovery__graph.svg')} alt=""/>
                            </div>
                            <h3>Access  our advanced data analysis tools</h3>
                            <p>
                                Detailed results for all past quizzes, enabling
                                you to track students’ progress over time.
                            </p>
                        </li>
                    </ul>
                </div>

                <div className="cq-discovery__quizalize">
                    <h1>Discover Quizalize</h1>
                    <h3>
                        If you haven’t discovered Quizalize yet,
                        the benefits of Quizalize Premium come on top of all the
                        great features of Quizalize Standard, such as:
                    </h3>
                    <h3 className="cq-discovery__quizalize__video">
                        <a href="https://www.youtube.com/watch?v=jmgMbEzkRUA" target="_blank">
                            Watch a video <img src={require('./../../../../assets/cq-discovery__play.svg')} alt=""/>
                        </a>
                    </h3>
                    <ul className="cq-discovery__quizalize__list__1">
                        <li>
                            Create unique quizzes tailored exactly to the needs of your class
                        </li>
                        <li>
                            Use one of hundreds of curriculum-linked quizzes created by other teachers
                        </li>
                        <li>
                            Set quizzes for homework and spot any individual learning gaps instantly
                        </li>
                        <li>
                            Play in class and use our Team Game view, so teams of students can compete against each other
                        </li>
                    </ul>
                    <ul className="cq-discovery__quizalize__list__2">
                        <li>
                            Export reports of students’ performance and overall class achievement
                        </li>
                        <li>
                            Publish unlimited quizzes to our Marketplace and earn income when other teachers buy them
                        </li>
                        <li>
                            Uses quizzes based on content from leading educational publishers
                        </li>
                        <li>
                            Create a unique profile page, so other teachers can discover your content
                        </li>
                    </ul>

                    <h4 className="cq-discovery__quizalize__more">
                        <a href="/">Find out more…</a>
                    </h4>

                </div>

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
