/* @flow */
import type {Quiz} from './../../../stores/QuizStore';

var React = require('react');

var router          = require(`./../../../config/router`);

var TransactionActions = require(`./../../../actions/TransactionActions`);
var QuizActions     = require(`./../../../actions/QuizActions`);
var QuizStore       = require(`./../../../stores/QuizStore`);
var GroupStore      = require(`./../../../stores/GroupStore`);

var UserStore       = require(`./../../../stores/UserStore`);

var CQViewQuizList  = require(`./../../../components/views/CQViewQuizList`);
var CQViewCreateApp = require('./../../../components/views/CQViewCreateApp');
var CQSpinner       = require(`./../../../components/utils/CQSpinner`);
var CQPublishQuiz   = require(`./../../../components/utils/CQPublishQuiz`);

var CQPageTemplate  = require(`./../../../components/CQPageTemplate`);
var CQLink          = require(`./../../../components/utils/CQLink`);

type State = {
    selectedQuizzes?: Array<Object>;
    quizzes: Array<Object>;
    isAdmin: boolean;
};

var CQQuizzes = React.createClass({

    propTypes: {
        appMode: React.PropTypes.bool,
        quizCode: React.PropTypes.string
    },

    getInitialState: function() {
        var initialState =  this.getState();
        initialState.selectedQuizzes = [];
        return initialState;
    },

    componentDidMount: function() {
        GroupStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);

        // let's check if there's a quiz refered
        console.log('PROPS', this.props);
        if (this.props.quizCode){
            TransactionActions.getSharedQuiz(this.props.quizCode);
        }
    },

    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function():State{

        var quizzes = QuizStore.getQuizzes();
        var isAdmin: boolean = UserStore.isAdmin();
        if (quizzes){
            quizzes.sort((a, b)=> a.timestamp > b.timestamp ? -1 : 1 );
        }
        return { quizzes,  isAdmin };
    },

    handleDelete: function(quiz: Object){

        var found = false;
        var groupContents = GroupStore.getGroupsContent();

        for (var i in groupContents) {

            if (groupContents[i].contentId === quiz.uuid) {
                found = true;
                swal('Cannot Delete', 'You cannot delete this quiz as you have this quiz assigned in class');
                break;
            }

            if (found) { break; }
        }
        if (!found) {
            //swal
            swal({
                title: 'Confirm Delete',
                text: 'Are you sure you want to permanently delete this quiz?',
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No'
            }, function(isConfirmed){
                if (isConfirmed){
                    QuizActions.deleteQuiz(quiz.uuid);
                }
            });
        }
    },

    handleClick: function(quiz: Quiz){
        if (quiz){
            router.setRoute(`/quiz/create/${quiz.uuid}`);
        }
    },

    handleAssign: function(quiz: Quiz){
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}/assign`);
        }
    },

    handleEdit: function(quiz: Quiz){
        console.log('edit???', quiz);
        if (quiz){
            router.setRoute(`/quiz/create/${quiz.uuid}`);
        }
    },

    handleSelect: function(selectedQuizzes: Array<Quiz>){
        this.setState({selectedQuizzes});
    },

    handleShare: function(quiz: Quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}/share`);
    },

    handlePreview: function(quiz: Quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.open(`/app#/preview/${quiz.meta.profileId}/${quiz.uuid}`, 'preview');
    },

    render: function() {


        if (this.state.quizzes === undefined || !QuizStore.isInitData()){
            return (
                <CQPageTemplate className="container cq-quizzes">
                    <CQSpinner/>
                </CQPageTemplate>
            );
        }

        var createApp;
        var newApp;
        var emptyState;
        var emptyQuizList;
        var introCopy = this.state.quizzes.length > 0 ? 'Here are your quizzes' : '';

        if (this.props.appMode) {
            createApp = (
                <CQViewCreateApp
                    selectedQuizzes={this.state.selectedQuizzes}
                />
            );
        }

        console.log('this.state.quizzes.length', this.state.quizzes.length);
        if (this.state.quizzes.length === 0 && QuizStore.isInitData()){
            emptyState = (
                <div className="cq-quizzes__empty">

                    <div className="">
                        <div className="quiz-preview">
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="quizalize-icon">
                                        <div className="zz-ic_quizalize"></div>
                                    </div>

                                    <div className="extra">
                                        <div className="intro">
                                            Welcome to <b>Quizalize</b>!
                                        </div>

                                        It looks like you haven't created any quizzes yet, but don't worry, you can start by doing the following
                                        <ol>
                                            <li>Read or print out our <a target="_blank" href="https://s3-eu-west-1.amazonaws.com/quizalize/Quizalize+Teacher+Guide.pdf">quick start guide</a></li>
                                            <li>Create a <CQLink href="/quiz/create">new quiz</CQLink> for your classroom. It only takes 60 seconds!</li>
                                            <li>Browse our <CQLink href="/quiz/marketplace">marketplace for content</CQLink> created by other Quizalize users.</li>
                                        </ol>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );

            emptyQuizList = (
                <div className="cq-quizzes__emptylist">
                    You don't have any quizzes yet on your account, <CQLink href="/quiz/create">why not you create your first one?</CQLink>
                    <p>or </p>
                    Browse the <CQLink href="/quiz/marketplace">marketplace</CQLink> to get quizzes created by other users
                </div>
            );
        }

        return (
            <CQPageTemplate className="cq-container cq-quizzes">


                <h2 className='cq-quizzes__header'>
                    <i className="fa fa-th-large"/> Your Quizzes
                </h2>
                {emptyState}

                <div className="cq-quizzes__actions">
                    {newApp}&nbsp;
                    <CQLink href="/quiz/create" className="btn btn-primary cq-quizzes__create">
                        <i className="fa fa-plus"></i> New quiz
                    </CQLink>
                </div>

                <p>
                    {introCopy}
                </p>

                {createApp}

                <CQViewQuizList
                    onQuizClick={this.handleClick}
                    showAuthor={false}
                    showReviewButton={false}
                    quizzes={this.state.quizzes}
                    selectMode={this.props.appMode === true}
                    onSelect={this.handleSelect}
                    sortBy='time'
                    sortOptions={this.state.isAdmin}
                    onAssign={this.handleAssign}
                    onDelete={this.handleDelete}>

                    <CQPublishQuiz className="cq-quizzes__button--publish"/>


                    <button className="cq-quizzes__button--share" onClick={this.handleShare}>
                        <span className="fa fa-share"></span> Share
                    </button>

                    <button className="cq-quizzes__button--edit" onClick={this.handleEdit}>
                        <span className="fa fa-pencil"></span> Edit
                    </button>

                    <button className="cq-quizzes__button--preview" onClick={this.handlePreview}>
                        <span className="fa fa-search"></span> Play
                    </button>

                    <button className="cq-quizzes__button--assign" onClick={this.handleAssign}>
                        <span className="fa fa-users"></span> Play in class
                    </button>

                    <button className="cq-quizzes__button--delete" onClick={this.handleDelete}>
                        <span className="fa fa-trash-o"></span>
                    </button>

                </CQViewQuizList>

                {emptyQuizList}

            </CQPageTemplate>
        );
    }

});

module.exports = CQQuizzes;
