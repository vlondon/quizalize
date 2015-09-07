/* @flow */
import React from 'react';
import router from './../../../config/router';

import CQPageTemplate from './../../../components/CQPageTemplate';


import CQAppGrid from './CQAppGrid';
import CQViewQuizList from './../../../components/views/CQViewQuizList';
import CQViewQuizFilter from './../../../components/views/CQViewQuizFilter';
import CQViewQuizDetails from './../../../components/views/CQViewQuizDetails';
import CQViewQuizPrice from './../../../components/utils/CQViewQuizPrice';
import CQPublicHeader from './CQPublicHeader';
import urlParams from './../../../utils/urlParams';

var TransactionActions = require('./../../../actions/TransactionActions');

import QuizActions from './../../../actions/QuizActions';
import QuizStore from './../../../stores/QuizStore';
import AppStore from './../../../stores/AppStore';
import UserStore from './../../../stores/UserStore';

import type {Quiz} from './../../../stores/QuizStore';
import type {User} from './../../../stores/UserStore';

type State = {
    user: User;
    quizzes: Array<Quiz>;
    showApps: boolean;
    showQuizzes: boolean;
    quizDetails: ?string;
    currentCategory: Object;
};

export default class CQPublic extends React.Component {

    state: State;

    constructor(props : Object) {
        super(props);
        this.state = {
            quizzes: QuizStore.getPublicQuizzes(),
            user: UserStore.getUser(),
            showApps: true,
            showQuizzes: true,
            quizDetails: undefined,
            currentCategory: {
                value: 'all'
            }
        };
        this.onChange = this.onChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
        var quizId = urlParams().quid;
        if (quizId) {
            QuizActions.loadPublicQuiz(quizId).then(TransactionActions.buyQuiz);
        }
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
        AppStore.removeChangeListener(this.onChange);
    }

    getState(): Object {
        var quizzes = QuizStore.getPublicQuizzes();
        return { quizzes };
    }

    onChange(){
        this.setState(this.getState());
    }

    handlePreview(quiz : Quiz){
        sessionStorage.setItem('mode', 'preview');
        window.open(`/app#/play/public/${quiz.uuid}`);

    }

    handleSet(quiz : Quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    }


    handleViewChange(options: string){
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
    }

    handleCategoryChange(currentCategory : Object) {
        this.setState({currentCategory});
    }

    handleDetails(quiz: Quiz){
        this.setState({quizDetails: quiz.uuid});
    }

    handleDetailsClose(){
        this.setState({quizDetails: undefined});
    }

    render() {

        var appGrid, quizList, quizDetails;
        var appsPerPage = this.state.showQuizzes ? 5 : 10;

        if (this.state.quizDetails) {
            quizDetails = (<CQViewQuizDetails
                onClose={this.handleDetailsClose}
                quizId={this.state.quizDetails}/>);
        }
        if (this.state.showApps){
            appGrid = (
                <div>
                    <CQAppGrid appsPerPage={appsPerPage}/>
                </div>
            );
        }
         if (this.state.showQuizzes) {

            quizList = (
                <div>

                    <CQViewQuizList
                        isQuizInteractive={true}
                        isPaginated={true}
                        onQuizClick={this.handleDetails}
                        quizzes={this.state.quizzes}
                        showCta={true}
                        className="cq-public__list"
                        sortBy="time">

                        <span className='cq-public__button' onClick={this.handlePreview}>
                            Play
                        </span>

                        <CQViewQuizPrice className='cq-public__button'/>

                    </CQViewQuizList>
                </div>
            );
        }
        return (
            <CQPageTemplate className="cq-container cq-public">
                <CQPublicHeader/>
                {quizDetails}

                <CQViewQuizFilter
                    appEnabled={true}
                    onViewChange={this.handleViewChange}
                    onCategoryChange={this.handleCategoryChange}
                    allTopics={true}/>


                {appGrid}
                {quizList}

            </CQPageTemplate>
        );
    }

}
