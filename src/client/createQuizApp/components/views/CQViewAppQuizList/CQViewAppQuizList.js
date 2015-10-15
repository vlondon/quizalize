/* @flow */
import React, { PropTypes } from 'react';
import CQViewQuizList from './../CQViewQuizList';
import CQQuizIcon from './../../../components/utils/CQQuizIcon';

import MeStore from './../../../stores/MeStore';
import CQQuizzesProfile from './../../../components/pages/CQQuizzes/CQQuizzesProfile';
import CQViewQuizPrice from './../../../components/utils/CQViewQuizPrice';
import CQViewQuizDetails from './../../../components/views/CQViewQuizDetails';
import TransactionStore from './../../../stores/TransactionStore';
import TransactionActions from './../../../actions/TransactionActions';

import priceFormat from './../../../utils/priceFormat';
import kolor from 'kolor';
import router from './../../../config/router';
import type {AppType} from './../../../stores/AppStore';
type Props = Object;
type State = Object;

class CQViewAppQuizList extends React.Component {

    props: Props;

    constructor(props: Props) {
        super(props);

        // console.log('apps sorting', apps);

        this.getState = this.getState.bind(this);
        this.handleQuizClick = this.handleQuizClick.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
        this.handleBuyApp = this.handleBuyApp.bind(this);

        this.state = this.getState(props);

    }

    getState(props : Props) : State {
        props = props || this.props;

        var apps = props.apps;

        apps.forEach(app => {
            app.meta.quizzes.sort((a, b)=> {
                return a.meta.name.toLowerCase() > b.meta.name.toLowerCase() ? 1 : -1;
            });
        });
        if (apps.length >= 2){
            apps.sort((a, b)=>{
                console.log('sorting, ', a, b);

                // this puts "own quizzes" on top;
                if (a.uuid === 'own') { return -1; }
                if (b.uuid === 'own') { return 1; }

                return a.meta.name.toLowerCase() > b.meta.name.toLowerCase() ? 1 : -1;

            });
        }
        return {apps};
    }

    componentWillReceiveProps(nextProps : Props) {
        this.setState(this.getState(nextProps));
    }

    handleQuizClick(quiz: Object){
        console.log('quizId clicked', quiz);
        if (this.props.own){

            router.setRoute(`/quiz/create/${quiz.uuid}`);
        } else {

            this.setState({quizDetails: quiz.uuid});
        }
    }
    handleDetailsClose(){
        this.setState({quizDetails: undefined});
    }

    handleBuyApp(app: AppType){
        console.log('buying app', app);
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

    render () : any {
        var quizButtons, quizDetails;


        if (this.props.own) {
            quizButtons = (<CQQuizzesProfile/>);
        } else {
            quizButtons = (<CQViewQuizPrice/>);
        }

        if (this.state.quizDetails) {
            quizDetails = (<CQViewQuizDetails
                onClose={this.handleDetailsClose}
                quizId={this.state.quizDetails}/>);
        }

        return (
            <div className="appquizlist">
                {quizDetails}
                <ul className="appquizlist__list">
                    {this.state.apps.map(app=>{

                        var quizIcon, buyApp;
                        var appColor = kolor(app.meta.colour);
                        var quizzes = [];
                        if (app.meta.quizzes) {
                            quizzes = app.meta.quizzes;
                        }
                        if (quizzes.length === 0){
                            return null;
                        }
                        if (app.uuid !== 'own'){
                            quizIcon = (<CQQuizIcon className="appquizlist__app__icon" name={app.meta.name} image={app.meta.iconURL}/>);
                            if (this.props.own !== true){

                                var buyAppLabel = app.meta.price && app.meta.price > 0 ? `Get all ${app.meta.quizzes.length} quizzes for ${priceFormat(app.meta.price, '$', 'us')} ` : 'Save app to your profile';

                                var getSave = function(){
                                    var appPrice = TransactionStore.getPriceInCurrency(app.meta.price, 'us');
                                    var quizPrice = 0;
                                    app.meta.quizzes.forEach(q=> {
                                        quizPrice += (TransactionStore.getPriceInCurrency(q.meta.price, 'us') * 100);
                                    });
                                    quizPrice = quizPrice / 100;
                                    var appQuizDifference = Math.round((quizPrice - appPrice) / quizPrice * 100);
                                    if (appQuizDifference !== NaN && appQuizDifference > 0){
                                        return (
                                            <span style={{padding: 5}}>
                                                Save  <b>{appQuizDifference}%</b> when buying the app
                                            </span>
                                        );
                                    }
                                };

                                buyApp = (
                                    <span>
                                        <button className="appquizlist__app__button" onClick={this.handleBuyApp.bind(this, app)}>
                                            {buyAppLabel}
                                        </button>
                                        {getSave()}

                                    </span>
                                );
                            }
                        }

                        return (
                            <li key={app.uuid} className="appquizlist__app" style={{backgroundColor: appColor.fadeOut(0.7)}}>
                                <div className="appquizlist__app__infowrapper">

                                    {quizIcon}
                                    <div className="appquizlist__left">

                                        <div className="appquizlist__app__info">
                                            <div className="appquizlist__app__info__text">
                                                <h3 className="appquizlist__app__name">
                                                    {app.meta.name}
                                                </h3>
                                                <p>
                                                    {app.meta.description}
                                                </p>
                                                {buyApp}

                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <CQViewQuizList
                                    quizzes={quizzes}
                                    className="appquizlist__list"
                                    onQuizClick={this.handleQuizClick}
                                >
                                    {quizButtons}
                                </CQViewQuizList>
                            </li>
                        );
                    })}
                </ul>
            </div>

        );
    }
}

CQViewAppQuizList.propTypes = {
    apps: PropTypes.array,
    own: PropTypes.bool
};

export default CQViewAppQuizList;
