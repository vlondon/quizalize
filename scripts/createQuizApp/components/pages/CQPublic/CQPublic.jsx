var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQPublicList = require('./CQPublicList');
var CQPublicSort = require('./CQPublicSort');
var CQAppGrid = require('./CQAppGrid');

var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');

var QuizStore  = require('createQuizApp/stores/QuizStore');

var TransactionActions = require('createQuizApp/actions/TransactionActions');
var AppActions = require('createQuizApp/actions/AppActions');
var AppStore = require('createQuizApp/stores/AppStore');


var router = require('createQuizApp/config/router');

require('./CQPublicStyles');

var CQPublic = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        AppActions.searchApps();
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.removeChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
    },

    getState: function(){

        var quizzes = QuizStore.getPublicQuizzes();
        var newState = { quizzes };

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

    render: function() {

        return (
            <CQPageTemplate className="container cq-public">
                <h2>
                    Choose a quiz for your class
                </h2>
                <p>
                    Check out our pre-made quizzes. We're adding new ones all
                    the time! If you have any suggestions, tell us! Otherwise, you can <CQLink href='/quiz/create'>create your own in 60 seconds</CQLink>.
                </p>

                <CQAppGrid/>

                <CQViewQuizList quizzes={this.state.quizzes} className="cq-public__list">
                    <span className='cq-public__button' onClick={this.handleBuy}>
                        Free
                    </span>
                </CQViewQuizList>
            </CQPageTemplate>
        );
    }

});

module.exports = CQPublic;
