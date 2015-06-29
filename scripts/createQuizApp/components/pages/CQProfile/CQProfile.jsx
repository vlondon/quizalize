var React = require('react');
var router = require('createQuizApp/config/router');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQDashboardProfile = require('../CQDashboard/extra/CQDashboardProfile');

var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');
var CQViewQuizFilter = require('createQuizApp/components/views/CQViewQuizFilter');
var CQViewQuizDetails = require('createQuizApp/components/views/CQViewQuizDetails');

var TransactionActions = require('createQuizApp/actions/TransactionActions');

var QuizActions  = require('createQuizApp/actions/QuizActions');
var QuizStore  = require('createQuizApp/stores/QuizStore');
var AppStore = require('createQuizApp/stores/AppStore');
var UserStore = require('createQuizApp/stores/UserStore');

var CQProfile = React.createClass({

    propTypes: {
        profileId: React.PropTypes.string,
        quizCode: React.PropTypes.string
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getState(nextProps));
        QuizActions.searchPublicQuizzes('', '', nextProps.profileId);
    },

    getInitialState: function() {
        var newState =  this.getState();
        newState.showQuizzes = true;
        newState.user = UserStore.getUser();
        QuizActions.searchPublicQuizzes('', '', this.props.profileId);
        return newState;
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        AppStore.removeChangeListener(this.onChange);
        UserStore.removeChangeListener(this.onChange);
    },

    getState: function(props){
        props = props || this.props;
        var quizzes = QuizStore.getPublicProfileQuizzes(props.profileId);

        if (quizzes) {
            var quiz = quizzes.filter( f => f.meta.code === props.quizCode )[0];
        }

        if (props.profileId) {
            var puser = UserStore.getPublicUser(props.profileId);
        }
        var newState = { puser, quizzes };

        if (quiz && props.quizCode) {
            newState.quizDetails = quiz.uuid;
        }
        return newState;

    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/play/public/${quiz.uuid}`);
        // window.location.href = `/app#/play/public/${quiz.uuid}`;

    },

    handleSet: function(quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    },

    handleBuy: function(quiz){
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
                    var url = `/quiz/login?redirect=${window.encodeURIComponent('/quiz/user/' + this.props.profileId)}`;
                    if (quizCode) {
                        url = `/quiz/login?redirect=${window.encodeURIComponent('/quiz/user/' + this.props.profileId + '/' + this.props.quizCode)}`;
                    }
                    router.setRoute(url);
                }
            });
        } else {
            TransactionActions.buyQuiz(quiz, this.props.quizCode === quiz.meta.code);
        }
    },

    handleDetails: function(quiz){
        this.setState({quizDetails: quiz.uuid});
    },

    handleDetailsClose: function(){
        this.props.quizCode = undefined;
        this.setState({quizDetails: undefined});
    },

    render: function() {

        var quizList, quizDetails;

        if (this.state.quizDetails) {
            quizDetails = (<CQViewQuizDetails
                onClose={this.handleDetailsClose}
                quizCode={this.props.quizCode}
                quizId={this.state.quizDetails}/>);
        }

        if (this.state.showQuizzes) {

            quizList = (
                <CQViewQuizList
                    isQuizInteractive={true}
                    isPaginated={true}
                    onQuizClick={this.handleDetails}
                    quizCode={this.props.quizCode}
                    quizzes={this.state.quizzes}
                    className="cq-public__list"
                    sortBy="time"/>
            );
        }
        return (
            <CQPageTemplate className="container cq-profile">
                <div className="cq-profile__left">
                    <CQDashboardProfile user={this.state.puser}/>
                </div>
                <div className="cq-profile__right">
                    <h3>Viewing public quizzes from {this.state.puser && this.state.puser.name}</h3>
                    {quizDetails}
                    <CQViewQuizFilter appEnabled={false} onViewChange={this.handleViewChange} allTopics={false} quizzes={this.state.quizzes} profileId={this.state.profileId}/>
                    {quizList}
                </div>


            </CQPageTemplate>
        );
    }

});

module.exports = CQProfile;
