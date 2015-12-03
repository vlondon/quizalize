/* @flow */
var React = require('react');

import { router } from './../../../config';

import {
    TransactionActions,
    QuizActions
} from './../../../actions';

import {
    QuizStore,
    GroupStore,
    MeStore
} from './../../../stores';


import {
    CQViewQuizList,
    CQViewCreateApp,
    CQSpinner,
    CQPublishQuiz,
    CQPageTemplate,
    CQLink
}  from './../../../components';

import type { Quiz } from './../../../../../types';

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
        var isAdmin: boolean = MeStore.isAdmin();
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

    handleNew: function(){
        router.setRoute(`/quiz/create`);
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

    handleAssignHomework: function(quiz: Quiz){
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}/assign?homework=true`);
        }
    },

    handleEdit: function(quiz: Quiz){
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
                    You don't have any quizzes yet on your account, <CQLink href="/quiz/create">why not create your first one?</CQLink>
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

                <div className="cq-quizzes__actions" >
                    {newApp}&nbsp;
                    <button onClick={this.handleNew} className="btn btn-primary cq-quizzes__create">
                        <i className="fa fa-plus"></i> New quiz
                    </button>
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
                    onAssignHomework={this.handleAssignHomework}
                    onDelete={this.handleDelete}>

                    {/* <CQPublishQuiz className="cq-quizzes__button--publish"/>*/}

                    <button className="cq-quizzes__button--share" onClick={this.handleShare}>
                        <span className="fa fa-share"></span> Share
                    </button>

                    <button className="cq-quizzes__button--edit" onClick={this.handleEdit}>
                        <span className="fa fa-pencil"></span> Edit
                    </button>

                    <button className="cq-quizzes__button--preview" onClick={this.handlePreview}>
                        <span className="fa fa-search"></span> Preview
                    </button>

                    <button className="cq-quizzes__button--assign" onClick={this.handleAssign}>
                        <span className="fa fa-users"></span> Play in class
                    </button>

                    <button className="cq-quizzes__button--assign" onClick={this.handleAssignHomework}>
                        <span className="fa fa-users"></span> Set as homeworkB
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
