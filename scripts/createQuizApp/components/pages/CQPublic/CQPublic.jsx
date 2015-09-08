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
import CQPublicNoResults from './CQPublicNoResults';
import urlParams from './../../../utils/urlParams';

import TransactionActions from './../../../actions/TransactionActions';

import QuizActions from './../../../actions/QuizActions';
import QuizStore from './../../../stores/QuizStore';
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
    noContent: boolean;
    search: string;
};

export default class CQPublic extends React.Component {

    state: State;

    constructor(props : Object) {
        super(props);
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
        this.setState({quizzes, noContent});

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

                        <span className='cq-public__button' onClick={this.handlePreview}>
                            Play
                        </span>

                        <CQViewQuizPrice className='cq-public__button'/>

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

        return (
            <CQPageTemplate className="cq-container cq-public">
                <CQPublicHeader/>
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

            </CQPageTemplate>
        );
    }

}
