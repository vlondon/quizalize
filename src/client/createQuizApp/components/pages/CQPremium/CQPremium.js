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
                <div className="cq-premium__block__header">

                    <h1>
                        You can use Quizalize with one class <br/>completely free forever!
                    </h1>
                    <h3>
                        You can do lots of other things for free as well, such as:
                    </h3>
                    <ul>
                        <li>Publish an unlimited number of quizzes to the marketplace - we like to share</li>
                        <li>Access the results of the most recent quiz your class took</li>
                        <li>Export reports of students’ performance and class progress</li>
                        <li>Create a unique teacher profile page, so other users can discover your content</li>
                    </ul>
                    <p>
                        But if that’s not enough, you can sign up for one of our premium accounts.
                        Premium accounts allow you to use unlimited quizzes with unlimited classes,
                        create unlimited private quizzes and to track students’ performance over time.

                    </p>
                    <div className="cq-premium__table">
                        <div className="cq-premium__row cq-premium__row1 cq-premium__header">
                            <div className="cq-premium__col1">
                                Feature
                            </div>
                            <div className="cq-premium__col2">
                                Free
                            </div>
                            <div className="cq-premium__col3">
                                Premium
                            </div>
                            <div className="cq-premium__col4">
                                School
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Number of teachers
                            </div>
                            <div className="cq-premium__col2">
                                1
                            </div>
                            <div className="cq-premium__col3">
                                1
                            </div>
                            <div className="cq-premium__col4">
                                <div>
                                    Small: 20 teachers <br/>
                                    Medium: 21-50 teachers <br/>
                                    Large: 50+ teachers <br/>
                                </div>
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Number of classes
                            </div>
                            <div className="cq-premium__col2">
                                1
                            </div>
                            <div className="cq-premium__col3">
                                Unlimited
                            </div>
                            <div className="cq-premium__col4">
                                Unlimited
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Number of quiz assignments per week
                            </div>
                            <div className="cq-premium__col2">
                                4
                            </div>
                            <div className="cq-premium__col3">
                                Unlimited
                            </div>
                            <div className="cq-premium__col4">
                                Unlimited
                            </div>
                        </div>


                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Max. number of private quizzes (not published to the marketplace)
                            </div>
                            <div className="cq-premium__col2">
                                5
                            </div>
                            <div className="cq-premium__col3">
                                Unlimited
                            </div>
                            <div className="cq-premium__col4">
                                Unlimited
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Access to detailed results for past quizzes
                            </div>
                            <div className="cq-premium__col2">
                                No
                            </div>
                            <div className="cq-premium__col3">
                                Yes
                            </div>
                            <div className="cq-premium__col4">
                                Yes
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                School profile page
                            </div>
                            <div className="cq-premium__col2">
                                No
                            </div>
                            <div className="cq-premium__col3">
                                No
                            </div>
                            <div className="cq-premium__col4">
                                Coming soon
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Department Head dashboards
                            </div>
                            <div className="cq-premium__col2">
                                No
                            </div>
                            <div className="cq-premium__col3">
                                No
                            </div>
                            <div className="cq-premium__col4">
                                Coming soon
                            </div>
                        </div>

                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Year Head dashboards
                            </div>
                            <div className="cq-premium__col2">
                                No
                            </div>
                            <div className="cq-premium__col3">
                                No
                            </div>
                            <div className="cq-premium__col4">
                                Coming soon
                            </div>
                        </div>


                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Head Teacher dashboards
                            </div>
                            <div className="cq-premium__col2">
                                No
                            </div>
                            <div className="cq-premium__col3">
                                No
                            </div>
                            <div className="cq-premium__col4">
                                Coming soon
                            </div>
                        </div>


                        <div className="cq-premium__row cq-premium__header">
                            <div className="cq-premium__col1">
                                Price
                            </div>
                            <div className="cq-premium__col2">
                                Free
                            </div>
                            <div className="cq-premium__col3">
                                $9.99/£6.49 per month
                            </div>
                            <div className="cq-premium__col4">
                                Small $399/£249 per year
                                Medium $799/£499 per year
                                Large $1199/£749 per year
                            </div>
                        </div>

                    </div>
                </div>
                <CQSettingsSubscriptions user={MeStore.state}/>
            </CQPageTemplate>
        );
    }
}

export default CQPremium;
