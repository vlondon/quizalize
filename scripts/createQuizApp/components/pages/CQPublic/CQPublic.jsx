var React = require('react');
var router = require('createQuizApp/config/router');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');


var CQAppGrid = require('./CQAppGrid');
var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');
var CQViewQuizFilter = require('createQuizApp/components/views/CQViewQuizFilter');
var CQViewQuizDetails = require('createQuizApp/components/views/CQViewQuizDetails');
var CQViewQuizPrice = require('createQuizApp/components/utils/CQViewQuizPrice');

var TransactionActions = require('createQuizApp/actions/TransactionActions');
var AppActions = require('createQuizApp/actions/AppActions');

var QuizStore  = require('createQuizApp/stores/QuizStore');
var AppStore = require('createQuizApp/stores/AppStore');
var UserStore = require('createQuizApp/stores/UserStore');



var CQPublic = React.createClass({

    getInitialState: function() {

        return {
            quizzes: QuizStore.getPublicQuizzes(),
            user: UserStore.getUser(),
            showApps: true,
            showQuizzes: true
        };

    },

    componentDidMount: function() {
        AppActions.searchPublicApps();
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        AppStore.removeChangeListener(this.onChange);
    },

    getState: function(){
        var quizzes = QuizStore.getPublicQuizzes();
        return { quizzes };
    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/play/public/${quiz.uuid}`);

    },

    handleSet: function(quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    },

    handleBuy: function(quiz){
        if (!this.state.user) {
            swal({
                title: 'You need to be logged in',
                text: `In order to buy this item you need to log into Quizalize`,
                type: 'info',
                confirmButtonText: 'Log in',
                showCancelButton: true
            }, function(isConfirm){
                if (isConfirm){
                    router.setRoute(`/quiz/login?redirect=${window.encodeURIComponent('/quiz/public')}`);
                }
            });
        } else {
            TransactionActions.buyQuiz(quiz);
        }
    },

    handleViewChange: function(options){
        switch (options){
            case 'all':
                this.setState({
                    showApps: true,
                    showQuizzes: true
                });
                break;

            case 'quizzes':
                this.setState({
                    showApps: false,
                    showQuizzes: true
                });
                break;
            case 'apps':
                this.setState({
                    showApps: true,
                    showQuizzes: false
                });
        }
    },

    handleDetails: function(quiz){
        this.setState({quizDetails: quiz.uuid});
    },

    handleDetailsClose: function(){
        this.setState({quizDetails: undefined});
    },

    render: function() {

        var appGrid, quizList, quizDetails;

        appGrid = this.state.showApps ? <CQAppGrid/> : undefined;

        if (this.state.quizDetails) {
            quizDetails = (<CQViewQuizDetails
                onClose={this.handleDetailsClose}
                quizId={this.state.quizDetails}/>);
        }

         if (this.state.showQuizzes) {

            quizList = (
                <CQViewQuizList
                    isQuizInteractive={true}
                    isPaginated={true}
                    onQuizClick={this.handleDetails}
                    quizzes={this.state.quizzes}
                    className="cq-public__list"
                    sortBy="time">

                    <span className='cq-public__button' onClick={this.handlePreview}>
                        Preview
                    </span>
                    <CQViewQuizPrice className='cq-public__button' onClick={this.handleBuy}/>

                </CQViewQuizList>
            );
        }
        return (
            <CQPageTemplate className="container cq-public">
                {quizDetails}

                <CQViewQuizFilter
                    appEnabled={true}
                    onViewChange={this.handleViewChange}
                    allTopics={true}/>

                {appGrid}
                {quizList}

            </CQPageTemplate>
        );
    }

});

module.exports = CQPublic;
