/* @flow */
import React from 'react';
import { router } from './../../../config';

import {
    CQPageTemplate,
    CQViewAppQuizList
} from './../../../components';

import {
    TransactionActions
} from './../../../actions';

import type {
    Quiz,
    AppType
} from './../../../../../types';

import {
    MeStore
} from './../../../stores';

import CQDashboardProfile from '../CQDashboard/extra/CQDashboardProfile';
import CQOwnProfileCounter from './CQOwnProfileCounter';


let getPrivateQuizzes = (apps) => {
    let privateQuizzes = [];
    apps.forEach(app=> {
        app.meta.quizzes.forEach(quiz=>{
            if (quiz.meta.published === null && (quiz.meta.originalQuizId === null || quiz.meta.originalQuizId === undefined)) {
                privateQuizzes.push(quiz);
            }
        });
    });
    return privateQuizzes;
};

class CQProfileView extends React.Component {

    constructor(props : Props){
        super(props);
        this.state = {
            user: MeStore.state
        };
    }

    handlePreview(quiz : Quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/play/public/${quiz.uuid}`);
        // window.location.href = `/app#/play/public/${quiz.uuid}`;

    }

    handleSet(quiz : Quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    }

    handleBuy(quiz : Quiz){
        var quizCode = this.props.quizCode;
        if (!this.state.user) {
            swal({
                title: 'You need to be logged in',
                text: `In order to buy this item you need to log into Quizalize`,
                type: 'info',
                confirmButtonText: 'Log in',
                showCancelButton: true
            }, function(isConfirm){
                if (isConfirm){
                    var url = `/quiz/login?redirect=${window.encodeURIComponent('/quiz/user/' + this.state.profile.uuid)}`;
                    if (quizCode) {
                        url = `/quiz/login?redirect=${window.encodeURIComponent('/quiz/user/' + this.state.profile.uuid + '/' + this.props.quizCode)}`;
                    }
                    router.setRoute(url);
                }
            });
        } else {
            TransactionActions.buyQuiz(quiz);
        }
    }
    handleNew(){
        router.setRoute(`/quiz/create`);
    }
    handleNewApp(){
        router.setRoute(`/quiz/apps/new`);
    }

    handleDetails(quiz : Quiz){
        this.setState({quizDetails: quiz.uuid});
    }


    render() {


        var headerCta;
        var amountOfPrivateQuizzes = getPrivateQuizzes(this.props.apps).length;

        var headerCta, noQuizMessage, ownProfileCounter;

        if (this.props.own) {
            if (MeStore.state.attributes.accountType === 0){
                ownProfileCounter = (<CQOwnProfileCounter amount={amountOfPrivateQuizzes}/>);
            }
            headerCta = (
                <div className="cq-profile__cta">
                    <button  onClick={this.handleNewApp} className="btn btn-primary cq-profile__cta__app">
                        <i className="fa fa-plus"></i> New collection of quizzes
                    </button>
                    &nbsp;
                    <button  onClick={this.handleNew} className="btn btn-primary ">
                        <i className="fa fa-plus"></i> New quiz
                    </button>
                    <div className="cq-profile__freeaccount">
                        {ownProfileCounter}
                    </div>

                </div>
            );
        }


        noQuizMessage = this.props.apps.length == 0 ? (
            <div>
                {this.props.profile ? this.props.profile.name : "This user"} has no publicly available content
            </div>
        ) : "";


        return (
            <CQPageTemplate className="cq-container cq-profile">

                <CQDashboardProfile user={this.props.profile} own={this.props.own}/>

                {headerCta}

                {noQuizMessage}

                <CQViewAppQuizList
                    apps={this.props.apps}
                    own={this.props.own}
                />



            </CQPageTemplate>
        );
    }
}

type Props = {
    profile: Object;
    apps: Array<AppType>;
    quizzes: Array<Quiz>;
    quizCode: string;
    own: boolean;
}

CQProfileView.propTypes = {
    profile: React.PropTypes.object,
    apps: React.PropTypes.array,
    quizzes: React.PropTypes.array,
    quizCode: React.PropTypes.string,
    own: React.PropTypes.bool
};

module.exports = CQProfileView;
