var React = require('react');

var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore = require('createQuizApp/stores/QuizStore');
var GroupStore = require('createQuizApp/stores/GroupStore');

var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');
var router = require('createQuizApp/config/router');

require('./CQQuizzesStyles');

var CQQuizzes = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        GroupStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){

        var quizzes = QuizStore.getQuizzes();
        quizzes = quizzes.sort((a, b)=> a.timestamp > b.timestamp ? -1 : 1 );
        console.log('quizzes', quizzes);
        return { quizzes };
    },

    handleDelete: function(quiz){
        var found = false;
        var groupContents = GroupStore.getGroupsContent();

        console.log('groupContents', quiz, groupContents);
        for (var i in groupContents) {

            console.log('quiz found', groupContents[i].contentId, quiz.uuid, groupContents[i].contentId === quiz.uuid);
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

    render: function() {

        var introCopy = this.state.quizzes.length === 0 ? 'Here are the quizzes you have created so far…' : 'Why don\'t you create a quiz for your class.';
        return (
            <CQPageTemplate className="container cq-quizzes">
                <div className="container">
                    <h2>Your Quizzes
                        <div className="pull-right">
                            <CQLink href="/quiz/create" className="btn btn-primary btn-lg">
                                Create a new quiz
                            </CQLink>
                        </div>
                    </h2>

                    <p>{introCopy}</p>

                    <CQViewQuizList
                        onQuizClick={this.handleClick}
                        showAuthor={false}
                        quizzes={this.state.quizzes}
                        actions={this.handleAction}>

                        <div className="cq-quizzes__buttonbar">
                            <div className="cq-quizzes__edit">
                                <span className="fa fa-pencil"></span> Edit
                            </div>
                            <button className="cq-quizzes__button--assign" onClick={this.handleDelete}>
                                <span className="fa fa-users"></span> Assign quiz to a Class
                            </button>

                            <button className="cq-quizzes__button--delete" onClick={this.handleDelete}>
                                <span className="fa fa-trash-o"></span>
                            </button>
                        </div>



                    </CQViewQuizList>

                    
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQQuizzes;
