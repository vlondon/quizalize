var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');

var CQAppGrid = require('./CQAppGrid');
var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');
var CQViewQuizFilter = require('createQuizApp/components/views/CQViewQuizFilter');

var TransactionActions = require('createQuizApp/actions/TransactionActions');
var AppActions = require('createQuizApp/actions/AppActions');

var QuizStore  = require('createQuizApp/stores/QuizStore');
var AppStore = require('createQuizApp/stores/AppStore');


var router = require('createQuizApp/config/router');

require('./CQPublicStyles');

var CQPublic = React.createClass({

    getInitialState: function() {
        var newState =  this.getState();
        newState.showApps = true;
        newState.showQuizzes = true;
        return newState;
    },

    componentDidMount: function() {
        AppActions.searchApps();
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        AppStore.removeChangeListener(this.onChange);
    },

    getState: function(){
        var quizzes = QuizStore.getPublicQuizzes();
        var newState = { quizzes };

        console.log('getting new state', quizzes);
        return newState;

    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.location.href = `/app#/play/public/${quiz.uuid}`;

    },

    handleSet: function(quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    },

    handleBuy: function(quiz){
        console.log('buy quiz?', quiz);
        swal({
                title: 'Confirm Purchase',
                text: `Are you sure you want purchase <br/><b>${quiz.meta.name}</b> <br/> for <b>free</b>`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                html: true
            }, (isConfirm) => {

            if (isConfirm){
                setTimeout(()=>{

                    var newTransaction = {
                        meta: {
                            type: 'quiz',
                            quizId: quiz.uuid,
                            profileId: quiz.meta.profileId,
                            price: 0
                        }
                    };

                    swal({
                        title: 'Working…',
                        text: `We're processing your order`,
                        showConfirmButton: false
                    });

                    console.log('storing transaction', newTransaction);
                    TransactionActions.saveNewTransaction(newTransaction)
                        .then(function(){
                            swal.close();
                            setTimeout(()=>{
                                swal({
                                    title: 'Purchase complete!',
                                    text: 'You will find the new content in your quizzes',
                                    type: 'success'
                                });
                            }, 100);
                        });

                }, 300);
            }
        });
    },

    handleViewChange: function(options){
        console.log('options', options);
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

    render: function() {

        var appGrid, quizList;
        if (this.state.showApps) {
            appGrid = (<CQAppGrid/>);
        }

        if (this.state.showQuizzes) {
            quizList = (
                <CQViewQuizList quizzes={this.state.quizzes} className="cq-public__list">
                    <span className='cq-public__button' onClick={this.handleBuy}>
                        Free
                    </span>
                </CQViewQuizList>
            );
        }
        return (
            <CQPageTemplate className="container cq-public">

                <CQViewQuizFilter onViewChange={this.handleViewChange}/>

                {appGrid}
                {quizList}

            </CQPageTemplate>
        );
    }

});

module.exports = CQPublic;
