/* @flow */
import React from "react";
import { router } from "./../../../config";

import {
    CQPageTemplate,
    CQViewQuizList,
    CQViewQuizFilter,
    CQViewQuizDetails,
    CQViewQuizPrice,
    CQViewWizard,
} from "./../../../components";



import {urlParams} from "./../../../utils";

import {
    TransactionActions,
    UserActions,
    QuizActions
} from "./../../../actions";

import {
    QuizStore,
    MeStore
} from "./../../../stores";


import CQAppGrid from "./CQAppGrid";
import CQPublicHeader from "./CQPublicHeader";
import CQPublicFooter from "./CQPublicFooter";
import CQPublicNoResults from "./CQPublicNoResults";
import type {Quiz} from "./../../../../../types";


type State = {
    quizzes: Array<Quiz>;
    showApps: boolean;
    showQuizzes: boolean;
    quizDetails: ?string;
    currentCategory: Object;
    noContent: boolean;
    search: string;
};

export default class CQMarketplace extends React.Component {

    state: State;

    constructor(props : Object) {
        super(props);
        var p = urlParams();
        if (p.token) {
            if (p.cancel) {
                location.href = "/quiz/login";
            }
            else {
                UserActions.loginWithToken(p.token);
            }
        }
        //

        var quizzes = QuizStore.getPublicQuizzes() || [];
        this.state = {
            quizzes,
            showApps: true,
            showQuizzes: true,
            quizDetails: undefined,
            noContent: false,
            search: "",
            currentCategory: {
                value: "all"
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
            case "all":
                this.setState({
                    showApps: true,
                    showQuizzes: true
                });
                break;

            case "quizzes":
                this.setState({
                    showApps: false,
                    showQuizzes: true
                });
                break;
            case "apps":
                this.setState({
                    showApps: true,
                    showQuizzes: false
                });
        }
    }

    handleCategoryChange(currentCategory : Object) {
        let search = "";
        this.setState({currentCategory, search});
    }
    handleSearchInput(search: string){
        let currentCategory = { value: "all" };
        this.setState({search, currentCategory});
    }

    handleDetails(quiz: Quiz){
        let ownedQuiz = QuizStore.getOwnedQuizByOriginalQuizId(quiz.uuid);
        if (ownedQuiz){
            router.setRoute(`/quiz/create/${ownedQuiz.uuid}`);
        } else {
            this.setState({quizDetails: quiz.uuid});
        }
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
                    >

                        <CQViewQuizPrice className="cq-public__button cq-public__button__main"/>

                    </CQViewQuizList>
                </div>
            );
        }

        var noContent;
        if (this.state.noContent) {
            noContent = <CQPublicNoResults keyword={this.state.search}/>;
            appGrid = quizList = undefined;

        }
        var header = MeStore.isLoggedIn() ? <CQPublicHeader/> : <CQPublicHeader/>;

        return (

            <CQPageTemplate className="cq-public">
                <CQViewWizard/>

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
