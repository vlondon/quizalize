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
import CQPublicFooter from './CQPublicFooter';
import CQPublicNoResults from './CQPublicNoResults';
import urlParams from './../../../utils/urlParams';

import TransactionActions from './../../../actions/TransactionActions';
import UserActions from './../../../actions/UserActions';


import QuizActions from './../../../actions/QuizActions';
import QuizStore from './../../../stores/QuizStore';
import UserStore from './../../../stores/UserStore';
import MeStore from './../../../stores/MeStore';

import type {Quiz} from './../../../stores/QuizStore';
import type {UserType} from './../../../../../types/UserType';

type State = {
    user: UserType;
    quizzes: Array<Quiz>;
    showApps: boolean;
    showQuizzes: boolean;
    quizDetails: ?string;
    currentCategory: Object;
    noContent: boolean;
    search: string;
};

export default class CQPublic extends React.Component {

    state: State;

    constructor(props : Object) {
        super(props);
        var p = urlParams();
        if (p.token) {
            UserActions.loginWithToken(p.token);
        }
        //

        var quizzes = QuizStore.getPublicQuizzes() || [];
        this.state = {
            quizzes,
            user: UserStore.getUser(),
            showApps: true,
            showQuizzes: true,
            quizDetails: undefined,
            noContent: false,
            search: '',
            currentCategory: {
                value: 'all'
            }
        };
        this.onChange = this.onChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
        this.handleSearchInput = this.handleSearchInput.bind(this);
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        var quizId = urlParams().quid;
        if (quizId) {
            QuizActions.loadPublicQuiz(quizId).then(TransactionActions.buyQuiz);
        }
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        var quizzes = QuizStore.getPublicQuizzes();
        var noContent = false;

        if (quizzes && quizzes.length === 0){
            noContent = true;
        }

        this.setState({
            quizzes,
            noContent
        });

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
    handleSearchInput(search: string){
        this.setState({search});
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

                        <CQViewQuizPrice className='cq-public__button cq-public__button__main'/>

                    </CQViewQuizList>
                </div>
            );
        }

        var noContent;
        if (this.state.noContent) {
            console.log('no content');
            noContent = <CQPublicNoResults keyword={this.state.search}/>;
            appGrid = quizList = undefined;

        }
        var header = MeStore.isLoggedIn() ? <CQPublicHeader/> : <CQPublicHeader/>;

        return (

            <CQPageTemplate className="cq-public">
                {header}
                <div className="cq-container">

                    {quizDetails}

                    <CQViewQuizFilter
                        appEnabled={true}
                        onViewChange={this.handleViewChange}
                        onCategoryChange={this.handleCategoryChange}
                        onSearchInput={this.handleSearchInput}
                        allTopics={true}/>


                    {noContent}
                    {appGrid}
                    {quizList}
                </div>
                <CQPublicFooter/>
            </CQPageTemplate>
        );
    }

}
