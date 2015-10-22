/* @flow */
import React from 'react';
import moment from 'moment';
import CQDiscoveryHeader from './../CQDiscovery/CQDiscoveryHeader';
import {
    CQPageTemplate
} from './../../../components';

import {
    TransactionActions
} from './../../../actions';

import {
    urlParams
} from './../../../utils';
import { MeStore } from './../../../stores';

type Props = {};

class CQPremium extends React.Component {

    props: Props;

    constructor(props : Props){
        super(props);

        this.onChange = this.onChange.bind(this);
        this.state = {
            upgradeOverlay: false
        };

        this.closeOverlay = this.closeOverlay.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handleContact = this.handleContact.bind(this);
        this.handleDowngrade = this.handleDowngrade.bind(this);
        this.handleMonthlySubscription = this.handleMonthlySubscription.bind(this);
        this.handleHalfYearSubscription = this.handleHalfYearSubscription.bind(this);
        this.handleYearSubscription = this.handleYearSubscription.bind(this);
        this.handleUpgrade = this.handleUpgrade.bind(this);

    }

    componentDidMount() {
        var params = urlParams();
        if (params.p === 'true'){
            // TODO Francesco: check this!
            swal('Thank you', `Your account has been updated successfuly.
            It might take a few minutes to update your subscription.`);
        }
        // console.log('params?', params);
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
        window.Intercom('showNewMessage', 'I want to know more about the Quizalize School Package');
    }

    handleDowngrade(){
        // TODO Francesco Write the message
        window.Intercom('showNewMessage', 'I would like to downgrade my account');
    }

    handleDone(){
        setTimeout(function(){
            window.location = '/quiz/premium?p=true';
        }, 2000);
    }

    handleUpgrade(){
        this.setState({upgradeOverlay: true});
    }

    closeOverlay(){
        this.setState({upgradeOverlay: false});
    }

    handleMonthlySubscription(){
        this.closeOverlay();
        if (MeStore.isPremium() === false){
            TransactionActions.buyMonthlySubscription().then(()=>{this.handleDone();});
        }
    }

    handleHalfYearSubscription(){
        this.closeOverlay();
        if (MeStore.isPremium() === false){
            TransactionActions.buyHalfYearSubscription().then(()=>{this.handleDone();});
        }
    }

    handleYearSubscription(){
        this.closeOverlay();
        if (MeStore.isPremium() === false){
            TransactionActions.buyYearSubscription().then(()=>{this.handleDone();});
        }
    }


    render () {

        let buttonFree;
        let buttonUnlimited;
        let {accountType, accountTypeExpiration} = MeStore.state.attributes;
        const {upgradeOverlay} = this.state;
        let overlayDom;
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
                <div>
                    <div className="cq-premium__cta--selected">
                        You have an Unlimited Account
                    </div>
                    Valid until <br/>
                    {moment(accountTypeExpiration).format("Do MMM YY")}
                </div>
            );
            buttonFree = (
                <div className="cq-premium__cta" onClick={this.handleDowngrade}>
                    Switch to a Free Account
                </div>
            );

        }

        if (upgradeOverlay){
            overlayDom = (
                <div className="cq-premium__overlay">
                    <div className="cq-premium__overlay__option" onClick={this.handleHalfYearSubscription}>
                        <i className="fa fa-chevron-right"/>
                        <div>
                            <b>6 months</b>
                        </div>
                        <div>
                            <span>$50 (that's $8.33 per month, <b>you save $10</b>)</span>
                        </div>
                        <div>
                            <span className="cq-premium__overlay__option__popular">Most popular option</span>
                        </div>
                    </div>
                    <div className="cq-premium__overlay__option" onClick={this.handleYearSubscription}>
                        <i className="fa fa-chevron-right"/>
                        <div><b>12 months</b></div>
                        <div><span>$80 (that's $6.66 per month, <b>you save $40</b>)</span></div>

                    </div>
                    <div className="cq-premium__overlay__option" onClick={this.handleMonthlySubscription}>
                        <i className="fa fa-chevron-right"/>
                        <div><b>Single month</b></div>
                        <div><span>$10 per month</span></div>

                    </div>
                </div>
            );
        }

        return (
            <CQPageTemplate className="cq-container cq-premium">
                {overlayDom}
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

                        <div className="cq-premium__row cq-premium__rowcta">
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
