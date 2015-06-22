var React = require('react');
var router = require('createQuizApp/config/router');

var AppStore = require('createQuizApp/stores/AppStore');
var TopicStore = require('createQuizApp/stores/TopicStore');
var CQViewQuizDetails = require('createQuizApp/components/views/CQViewQuizDetails');

var TransactionActions = require('createQuizApp/actions/TransactionActions');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');


var CQApp = React.createClass({

    propTypes: {
        appId: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
        TopicStore.removeChangeListener(this.onChange);
        document.body.style.backgroundColor = '';
    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/play/public/${quiz.uuid}`);
    },

    getState: function(){
        var appInfo = AppStore.getAppInfo(this.props.appId);
        console.trace('getting info from app', appInfo);

        if (appInfo.meta && appInfo.meta.colour){
            document.body.style.backgroundColor = appInfo.meta.colour;
        }

        return {appInfo};
    },

    handleBuy: function(){

        var app = this.state.appInfo;

        swal({
                title: 'Confirm Purchase',
                text: `Are you sure you want to purchase <br/><b>${app.meta.name}</b> <br/> for <b>free</b>`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                html: true
            }, (isConfirm) => {

            if (isConfirm){
                setTimeout(()=>{

                    var newTransaction = {
                        meta: {
                            type: 'app',
                            appId: app.uuid,
                            profileId: app.meta.profileId,
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
                            console.log('transaction finished');
                            swal.close();
                            setTimeout(()=>{
                                swal({
                                    title: 'Purchase complete!',
                                    text: 'You will find the new content in your quizzes',
                                    type: 'success'
                                }, ()=>{
                                    router.setRoute('/quiz/quizzes');
                                });
                            }, 500);
                        });

                }, 300);
            }
        });




    },

    handleDetails: function(quiz){
        this.setState({quizDetails: quiz.uuid});
    },

    handleDetailsClose: function(){
        this.setState({quizDetails: undefined});
    },


    render: function() {
        var quizDetails;
        if (this.state.quizDetails) {
            quizDetails = (<CQViewQuizDetails
                onClose={this.handleDetailsClose}
                quizId={this.state.quizDetails}/>);
        }

        if (this.state.appInfo && this.state.appInfo.meta){

            return (
                <CQPageTemplate>
                    {quizDetails}
                    <div className="cq-app">
                        <CQQuizIcon
                            className="cq-app__icon"
                            name={this.state.appInfo.meta.name}
                            image={this.state.appInfo.meta.iconURL}/>

                        <div className="cq-app__info">
                            <h2>{this.state.appInfo.meta.name}</h2>
                            <div className="cq-app__price">Free</div>
                            <button className="cq-app__button" onClick={this.handleBuy}>
                                Use for free
                            </button>

                        </div>
                        <div className="cq-app__description">
                            <p>{this.state.appInfo.meta.description}</p>
                        </div>

                        <div className="cq-app__quizlist">
                            <CQViewQuizList
                                isQuizInteractive={true}
                                onQuizClick={this.handleDetails}
                                quizzes={this.state.appInfo.extra.quizzes}
                                sortBy="category">
                                <span className='cq-app__buttonextra' onClick={this.handlePreview}>
                                    Preview
                                </span>
                                <span></span>
                            </CQViewQuizList>
                        </div>
                    </div>
                </CQPageTemplate>
            );
        } else {
            return (<CQPageTemplate/>);
        }
    }

});

module.exports = CQApp;
