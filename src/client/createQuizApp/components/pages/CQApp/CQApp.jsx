/* @flow */
import React from 'react';
import { router } from './../../../config';

import {
    AppStore,
    TopicStore,
    MeStore,
    TransactionStore
} from './../../../stores';

import {
    CQViewQuizPrice,
    CQLinkToUser,
    CQViewQuizDetails,
    CQPageTemplate,
    CQQuizIcon,
    CQViewQuizList,
} from './../../../components';

import { priceFormat } from './../../../utils';
import { TransactionActions } from './../../../actions';


import type {Quiz} from './../../../stores/QuizStore';
import type {AppType} from './../../../stores/AppStore';



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
    routeParams: { appId: string };
}

type State = {
    appInfo: ?AppType;
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
        if (this.props.routeParams.appId) {
            var appInfo = AppStore.getAppInfo(this.props.routeParams.appId);

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
            if (!MeStore.isLoggedIn()){
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

        let {appInfo} = this.state;
        let author;
        if (this.state.appInfo && this.state.appInfo.extra && this.state.appInfo.extra.author.name){
            author = (
                <span>by <CQLinkToUser uuid={this.state.appInfo.extra.author.uuid} slug={this.state.appInfo.extra.author.profileUrl}>{this.state.appInfo.extra.author.name}</CQLinkToUser></span>
            );
        }
        let getSave = function(){
            let app = appInfo;
            if (app && app.meta && app.extra && app.extra.quizzes){

                let quizPrice = 0;
                app.extra.quizzes.forEach(q=> {
                    quizPrice += (TransactionStore.getPriceInCurrency(q.meta.price, 'us') * 100);
                });

                let appPrice = TransactionStore.getPriceInCurrency(app.meta.price, 'us');
                quizPrice = quizPrice / 100;
                let appQuizDifference = Math.round((quizPrice - appPrice) / quizPrice * 100);
                if (appQuizDifference !== NaN && appQuizDifference > 0){
                    return (
                        <div>
                            <span style={{padding: 5}}>
                                Save  <b>{appQuizDifference}%</b> when buying the app
                            </span>
                            <br/><br/>
                        </div>
                    );
                }

            }
        };




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
                                Play all in class for {priceFormat(this.state.appInfo.meta.price, '$', 'us')}
                            </button>
                            <br/>
                            {getSave()}


                        </div>
                        <div className="cq-app__author">
                            {author}
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

                                <CQViewQuizPrice className='cq-public__button cq-public__button__main'/>
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
CQApp.propTypes = {
    routeParams: React.PropTypes.object
};
