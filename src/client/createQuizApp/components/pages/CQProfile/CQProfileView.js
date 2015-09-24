/* @flow */
var React = require('react');
var router = require('./../../../config/router');

import AppStore from './../../../stores/AppStore';

var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQDashboardProfile = require('../CQDashboard/extra/CQDashboardProfile');
import CQViewAppGrid from './../../views/CQViewAppGrid';

var CQViewQuizList = require('./../../../components/views/CQViewQuizList');
import CQViewAppQuizList from './../../../components/views/CQViewAppQuizList';
// var CQViewQuizDetails = require('./../../../components/views/CQViewQuizDetails')

var TransactionActions = require('./../../../actions/TransactionActions');

import type {Quiz} from './../../../stores/QuizStore';
import type {AppType} from './../../../stores/AppStore';

class CQProfileView extends React.Component {

    constructor(props : Props){
        super(props);
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
        router.setRoute(`/quiz/app/new`);
    }

    handleDetails(quiz : Quiz){
        this.setState({quizDetails: quiz.uuid});
    }

    handleDetailsClose(){
        // this.props.quizCode = undefined;
        // this.setState({quizDetails: undefined});
    }

    render() {

        var quizList, quizDetails, headerCta;

        if (this.props.own) {

            headerCta = (
                <div className="cq-profile__cta">
                    <button  onClick={this.handleNewApp} className="btn btn-primary cq-profile__cta__app">
                        <i className="fa fa-plus"></i> New collection of quizzes
                    </button>
                    &nbsp;
                    <button  onClick={this.handleNew} className="btn btn-primary ">
                        <i className="fa fa-plus"></i> New quiz
                    </button>

                </div>
            );
        }
        // if (this.state.quizDetails) {
        //     quizDetails = (<CQViewQuizDetails
        //         onClose={this.handleDetailsClose}
        //         quizCode={this.props.quizCode}
        //         quizId={this.state.quizDetails}/>);
                // quizCode={this.props.quizCode}
        // }
        var quizzes = this.props.quizzes || [];
        quizList = (
            <CQViewQuizList
                isQuizInteractive={true}
                isPaginated={true}
                onQuizClick={this.handleDetails}
                quizzes={quizzes}
                className="cq-public__list"
                sortBy="time"/>
        );
        return (
            <CQPageTemplate className="cq-container cq-profile">

                <CQDashboardProfile user={this.props.profile}/>

                {headerCta}

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
    profile: React.PropTypes.oject,
    apps: React.PropTypes.array,
    quizzes: React.PropTypes.array,
    quizCode: React.PropTypes.string,
    own: React.PropTypes.boolean
};

module.exports = CQProfileView;
