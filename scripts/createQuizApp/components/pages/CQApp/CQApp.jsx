/* @flow */
var React = require('react');
var router = require('./../../../config/router');

import AppStore from './../../../stores/AppStore';
var TopicStore = require('./../../../stores/TopicStore');
var CQViewQuizDetails = require('./../../../components/views/CQViewQuizDetails');

import priceFormat from './../../../utils/priceFormat';
var TransactionActions = require('./../../../actions/TransactionActions');

var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQQuizIcon = require('./../../../components/utils/CQQuizIcon');
var CQViewQuizList = require('./../../../components/views/CQViewQuizList');
var UserStore = require('./../../../stores/UserStore');

import type {Quiz} from './../../../stores/QuizStore';
import type {App} from './../../../stores/AppStore';



var addClassName = function(el, className){
    if (el.classList)
        el.classList.add(className);
    else
        el.className += ' ' + className;
};

var removeClassName = function(el, className){
    if (el.classList)
        el.classList.remove(className);
    else
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
};

type Props = {
    appId: string;
}

type State = {
    appInfo: ?App;
}

export default class CQApp extends React.Component {

    props: Props;
    state: State;

    constructor(props:Props) {
        super(props);
        this.state =  this.getState();
        this.handleDetails = this.handleDetails.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount () {
        AppStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
    }

    componentWillUnmount () {
        AppStore.removeChangeListener(this.onChange);
        TopicStore.removeChangeListener(this.onChange);
        document.body.style.backgroundColor = '';
        removeClassName(document.body, 'quizalize__appmode');
    }

    onChange (){
        this.setState(this.getState());
    }

    handlePreview (quiz:Quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/play/public/${quiz.uuid}`);
    }

    getState(): Object {
        if (this.props.appId) {
            var appInfo = AppStore.getAppInfo(this.props.appId);

            if (appInfo){
                if (appInfo.meta && appInfo.meta.colour){
                    document.body.style.backgroundColor = appInfo.meta.colour;
                    addClassName(document.body, 'quizalize__appmode');
                }
            }
            return {appInfo};
        }
        else {
            return {};
        }
    }

    handleBuy (){
        if (this.state.appInfo){
            var app = this.state.appInfo;
            if (!UserStore.isLoggedIn()){
                swal({
                    title: 'You need to be logged in',
                    text: `In order to buy this item you need to log into Quizalize`,
                    type: 'info',
                    confirmButtonText: 'Log in',
                    showCancelButton: true
                }, function(isConfirm){
                    if (isConfirm){
                        var redirectUrl = window.encodeURIComponent('/quiz/app/' + app.uuid);
                        router.setRoute(`/quiz/login?redirect=${redirectUrl}`);
                    }
                });
            } else {
                TransactionActions.buyApp(app);
            }
        }


    }

    handleDetails(quiz:Quiz){
        this.setState({quizDetails: quiz.uuid});
    }

    handleDetailsClose(){
        this.setState({quizDetails: undefined});
    }

    render () {
        var quizDetails;
        if (this.state.quizDetails) {
            quizDetails = (<CQViewQuizDetails
                onClose={this.handleDetailsClose}
                quizId={this.state.quizDetails}/>);
        }
        var description = this.state.appInfo ? this.state.appInfo.meta.description : '';

        if (this.state.appInfo && this.state.appInfo.meta){
            var quizzes = this.state.appInfo.extra ? this.state.appInfo.extra.quizzes :  [];

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

                            <button className="cq-app__button" onClick={this.handleBuy.bind(this)}>
                                Get it for {priceFormat(this.state.appInfo.meta.price, '$', 'us')}
                            </button>

                        </div>
                        <div className="cq-app__description">
                            <p>{description}</p>
                        </div>

                        <div className="cq-app__quizlist">
                            <CQViewQuizList
                                isQuizInteractive={true}
                                onQuizClick={this.handleDetails}
                                quizzes={quizzes}
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
}
