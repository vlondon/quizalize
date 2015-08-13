/* @flow */
var React = require('react');
var router = require('./../../../config/router');

var CQPageTemplate = require('./../../../components/CQPageTemplate');


var CQAppGrid = require('./CQAppGrid');
var CQViewQuizList = require('./../../../components/views/CQViewQuizList');
var CQViewQuizFilter = require('./../../../components/views/CQViewQuizFilter');
var CQViewQuizDetails = require('./../../../components/views/CQViewQuizDetails');
var CQViewQuizPrice = require('./../../../components/utils/CQViewQuizPrice');
var CQPublicHeader = require('./CQPublicHeader');
var CQLink = require('./../../../components/utils/CQLink');

var TransactionActions = require('./../../../actions/TransactionActions');

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
        this.handleBuy = this.handleBuy.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleDetails = this.handleDetails.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
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

    handleBuy(quiz : Quiz){
        console.log("should we buy????");
        if (!this.state.user) {
            swal({
                title: 'You need to be logged in',
                text: `In order to buy this item you need to log into Quizalize`,
                type: 'info',
                confirmButtonText: 'Log in',
                showCancelButton: true
            }, function(isConfirm){
                if (isConfirm){
                    router.setRoute(`/quiz/login?redirect=${window.encodeURIComponent('/quiz/marketplace')}`);
                }
            });
        } else {
            TransactionActions.buyQuiz(quiz);
        }
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
        if (this.state.showApps ){
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
                            Preview
                        </span>
                        <CQViewQuizPrice className='cq-public__button' onClick={this.handleBuy}/>

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

                <CQLink href={`/quiz/create?c=${this.state.currentCategory.value}`}>
                    <button className="cq-public__new-quiz">
                        Create new Quiz
                    </button>
                </CQLink>

                {appGrid}
                {quizList}

            </CQPageTemplate>
        );
    }

}
