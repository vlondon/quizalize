var React = require('react');

var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore = require('createQuizApp/stores/QuizStore');
var GroupStore = require('createQuizApp/stores/GroupStore');
var AppStore = require('createQuizApp/stores/AppStore');
var UserStore = require('createQuizApp/stores/UserStore');

var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');
var CQViewAppGrid = require('createQuizApp/components/views/CQViewAppGrid');
var CQViewCreateApp = require('createQuizApp/components/views/CQViewCreateApp');

var CQSpinner = require('createQuizApp/components/utils/CQSpinner');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');
var router = require('createQuizApp/config/router');


var CQQuizzes = React.createClass({

    propTypes: {
        appMode: React.PropTypes.bool
    },

    getInitialState: function() {
        var initialState =  this.getState();
        initialState.selectedQuizzes = [];
        initialState.isAdmin = UserStore.isAdmin();
        return initialState;
    },

    componentDidMount: function() {
        GroupStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
        AppStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){

        var quizzes = QuizStore.getQuizzes();
        var apps = AppStore.getApps();
        if (quizzes){
            quizzes.sort((a, b)=> a.timestamp > b.timestamp ? -1 : 1 );
        }
        return { quizzes, apps };
    },

    handleDelete: function(quiz){
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

    handleClick: function(quiz){
        if (quiz){
            router.setRoute(`/quiz/create/${quiz.uuid}`);
        }
    },

    handleAssign: function(quiz){
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}`);
        }
    },

    handleEdit: function(quiz){
        console.log('edit???', quiz);
        if (quiz){
            router.setRoute(`/quiz/create/${quiz.uuid}`);
        }
    },

    handleSelect: function(selectedQuizzes){
        this.setState({selectedQuizzes});
    },

    render: function() {


        if (this.state.quizzes === undefined || this.state.apps === undefined){
            return (
                <CQPageTemplate className="container cq-quizzes">
                    <CQSpinner/>
                </CQPageTemplate>
            );
        }

        var createApp;
        var apps;
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

        if (this.state.isAdmin){
            apps = (
                <div className="container">
                    <h2>Your apps</h2>
                    <CQViewAppGrid
                        editMode={true}
                        apps={this.state.apps}/>
                </div>
            );
            newApp = (
                <CQLink href="/quiz/quizzes/app" className="btn btn-primary">
                    <i className="fa fa-plus"></i> New app
                </CQLink>
            );
        }

        if (this.state.quizzes.length === 0){
            emptyState = (
                <div className="row cq-quizzes__empty">

                    <div className="row well">
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
                                            <li>Experience Quizalize by playing our Quiz of the Day</li>
                                            <li>Create a <CQLink href="/quiz/create">new quiz</CQLink> for your classrom. It only takes 60 seconds!</li>
                                            <li>Browse our <CQLink href="/quiz/public">marketplace for content</CQLink> created by other Quizalize users.</li>
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
                    Browse the <CQLink href="/quiz/public">marketplace</CQLink> to get quizzes created by other users
                </div>
            );
        }


        return (
            <CQPageTemplate className="container cq-quizzes">

                <div className="container">
                    {emptyState}


                    {apps}

                    <h2>Your Quizzes
                        <div className="pull-right">
                            {newApp}&nbsp;
                            <CQLink href="/quiz/create" className="btn btn-primary">
                                <i className="fa fa-plus"></i> New quiz
                            </CQLink>
                        </div>
                    </h2>

                    <p>{introCopy}</p>

                    {createApp}

                    <CQViewQuizList
                        onQuizClick={this.handleClick}
                        showAuthor={false}
                        quizzes={this.state.quizzes}
                        selectMode={this.props.appMode === true}
                        onSelect={this.handleSelect}
                        sortBy='time'
                        sortOptions={this.state.isAdmin}
                        onAssign={this.handleAssign}
                        onEdit={this.handleEdit}
                        onDelete={this.handleDelete}
                        actions={this.handleAction}>


                            <button className="cq-quizzes__button--edit" onClick={this.handleEdit}>
                                <span className="fa fa-pencil"></span> Edit
                            </button>

                            <button className="cq-quizzes__button--assign" onClick={this.handleAssign}>
                                <span className="fa fa-users"></span> Assign quiz to a Class
                            </button>

                            <button className="cq-quizzes__button--delete" onClick={this.handleDelete}>
                                <span className="fa fa-trash-o"></span>
                            </button>

                    </CQViewQuizList>
                    {emptyQuizList}

                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQQuizzes;
