/* @flow */
var React = require('react');
var router = require('./../../../config/router');


var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQDashboardProfile = require('../CQDashboard/extra/CQDashboardProfile');

import CQViewAppQuizList from './../../../components/views/CQViewAppQuizList';
import CQOwnProfileCounter from './CQOwnProfileCounter';
// var CQViewQuizDetails = require('./../../../components/views/CQViewQuizDetails')

var TransactionActions = require('./../../../actions/TransactionActions');

import type {Quiz} from './../../../stores/QuizStore';
import type {AppType} from './../../../stores/AppStore';


let getPrivateQuizzes = (apps) => {
    let privateQuizzes = [];
    apps.forEach(app=> {
        app.meta.quizzes.forEach(quiz=>{
            if (quiz.meta.published === null) {
                privateQuizzes.push(quiz);
            }
        });
    });
    console.log('privateQuizzes', privateQuizzes);
    return privateQuizzes;
};

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
        router.setRoute(`/quiz/apps/new`);
    }

    handleDetails(quiz : Quiz){
        this.setState({quizDetails: quiz.uuid});
    }


    render() {


        var headerCta;
        var amountOfPrivateQuizzes = getPrivateQuizzes(this.props.apps).length;

        var headerCta, noQuizMessage;

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
                    <div className="cq-profile__freeaccount">
                        <CQOwnProfileCounter amount={amountOfPrivateQuizzes}/>
                    </div>

                </div>
            );
        }


        noQuizMessage = this.props.apps.length == 0 ? (
            <div>
                {this.props.profile ? this.props.profile.name : "This user"} has no publicly available content
            </div>
        ) : "";


        // if (this.state.quizDetails) {
        //     quizDetails = (<CQViewQuizDetails
        //         onClose={this.handleDetailsClose}
        //         quizCode={this.props.quizCode}
        //         quizId={this.state.quizDetails}/>);
                // quizCode={this.props.quizCode}
        // }

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
