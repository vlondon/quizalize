/* @flow */
import React from 'react';
import CQDiscoveryHeader from './../CQDiscovery/CQDiscoveryHeader';
import {
    CQPageTemplate
} from './../../../components';

import {
    TransactionActions
} from './../../../actions';

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

    handleContact(){
        // TODO Francesco Write the message
        window.Intercom('showNewMessage', 'I want to know more about Quizalize School Package');
    }

    handleDowngrade(){
        // TODO Francesco Write the message
        window.Intercom('showNewMessage', 'Donwgrade my account');
    }

    handleMonthlySubscription(){
        if (MeStore.isPremium() === false){
            TransactionActions.buyMonthlySubscription();
        }
    }


    render () {

        let buttonFree;
        let buttonUnlimited;
        let {accountType} = MeStore.state.attributes;
        let buttonSchool = (
            <a className="cq-premium__cta" onClick={this.handleContact}>
                Get Price
            </a>
        );


        if (accountType === 0){
            buttonUnlimited = (
                <a className="cq-premium__cta" onClick={this.handleUpgrade}>
                    Upgrade your account
                </a>
            );
            buttonFree = (
                <div className="cq-premium__cta--selected">
                    You  have a free account
                </div>
            );
        } else if (accountType === 1) {
            buttonUnlimited = (
                <div className="cq-premium__cta--selected">
                    You have an Unlimited Account
                </div>
            );
            buttonFree = (
                <div className="cq-premium__cta" onClick={this.handleDowngrade}>
                    Switch to a Free Account
                </div>
            );

        }

        return (
            <CQPageTemplate className="cq-container cq-premium">
                <div className="cq-premium__block__header">
                    <h1>
                        Subscribe to help us!
                    </h1>
                    <p className="cq-premium__block__header__p1">
                        We are really excited to have been awarded £250k grant
                        from the UK government, but need to raise £250k of
                        private funding to unlock it. Here’s what it’s for:
                    </p>


                    <ul>
                        <li>Better dashboards showing student progress</li>
                        <li>Algorithms that personalise learning for each student</li>
                        <li>Turn your quizzes into real Apple and Google apps</li>
                    </ul>
                    <p>
                        We are a tiny team, passionate about making a real difference,
                        and we'll use every penny to make our product better for you.
                        Please buy a Premium or School subscription to help make this happen!
                        Thank you.
                    </p>

                    <p className="cq-premium__block__header__signature">
                        <img src={require('./../../../../assets/cq-premium__charles.png')} alt="" width="250"/><br/>
                        Founder and CEO of Zzish<br/>Creator of Quizalize
                    </p>

                </div>
                <div className="cq-premium__block__body">
                    <h1>Plans and Pricing</h1>


                    <div className="cq-premium__table">
                        <div className="cq-premium__row cq-premium__row1 cq-premium__table__header">
                            <div className="cq-premium__col1">

                            </div>
                            <div className="cq-premium__col2">
                                Basic
                            </div>
                            <div className="cq-premium__col3">
                                <div className="cq-premium__col3__inner">
                                    Unlimited
                                    <div className="cq-premium__bestvalue">
                                        Best <br/>
                                        Value
                                    </div>
                                </div>

                            </div>
                            <div className="cq-premium__col4">
                                <div>
                                    School<br/>Package
                                </div>
                            </div>
                        </div>

                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">

                            </div>
                            <div className="cq-premium__col2">
                                Free forever
                            </div>
                            <div className="cq-premium__col3">
                                from $6.67/mth
                            </div>
                            <div className="cq-premium__col4">
                                dependent on school size
                            </div>
                        </div>

                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">

                            </div>
                            <div className="cq-premium__col2">
                                {buttonFree}
                            </div>
                            <div className="cq-premium__col3">
                                {buttonUnlimited}
                            </div>
                            <div className="cq-premium__col4">
                                {buttonSchool}
                            </div>
                        </div>

                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">
                                Teachers
                            </div>
                            <div className="cq-premium__col2">
                                1
                            </div>
                            <div className="cq-premium__col3">
                                1
                            </div>
                            <div className="cq-premium__col4">
                                <div>
                                    Unlimited
                                </div>
                            </div>
                        </div>

                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">
                                Classes
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

                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">
                                Private quizzes
                            </div>
                            <div className="cq-premium__col2">
                                yes, up to 5
                            </div>
                            <div className="cq-premium__col3">
                                Unlimited
                            </div>
                            <div className="cq-premium__col4">
                                Unlimited
                            </div>
                        </div>




                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">
                                Student improvement
                            </div>
                            <div className="cq-premium__col2">
                                Yes
                            </div>
                            <div className="cq-premium__col3">
                                Yes
                            </div>
                            <div className="cq-premium__col4">
                                Yes
                            </div>
                        </div>

                        <div className="cq-premium__row ">
                            <div className="cq-premium__col1">
                                View past results
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


                        <div className="cq-premium__row cq-premium__footer">
                            <div className="cq-premium__col1">
                                Dashboards
                            </div>
                            <div className="cq-premium__col2">
                                <div>
                                    Latest quiz only <br/>
                                    Student improvement
                                </div>
                            </div>
                            <div className="cq-premium__col3">
                                <div>
                                    Latest quiz <br/>
                                    + Previous quizzes <br/>
                                    Student improvement
                                </div>
                            </div>
                            <div className="cq-premium__col4">
                                <div>
                                    Latest quiz <br/>
                                    + Previous quizzes <br/>
                                    + Department* <br/>
                                    + Head Teacher* <br/>
                                    Student improvement
                                </div>
                            </div>
                        </div>


                        <div className="cq-premium__legend">
                            * coming soon
                        </div>

                    </div>
                </div>
                <CQDiscoveryHeader showHeader={true}/>
            </CQPageTemplate>
        );
    }
}

export default CQPremium;
