
import React, { PropTypes } from 'react';
import type {Quiz} from './../../../stores/QuizStore';
import GroupStore from './../../../stores/GroupStore';
import CQPublishQuiz from './../../../components/utils/CQPublishQuiz';

var QuizActions     = require(`./../../../actions/QuizActions`);
var router          = require(`./../../../config/router`);

type Props = {
    quiz: Quiz;
}
class CQQuizzesProfile extends React.Component {
    props: Props;
    constructor(props: Props){
        super(props);
        this.handleShare = this.handleShare.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }
    handleShare(){
        router.setRoute(`/quiz/published/${this.props.quiz.uuid}/share`);
    }
    handleEdit(){
        if (this.props.quiz){
            router.setRoute(`/quiz/create/${this.props.quiz.uuid}`);
        }

    }
    handlePreview(){
        var quiz = this.props.quiz;
        sessionStorage.setItem('mode', 'teacher');
        QuizActions.loadQuiz(quiz.uuid).then( (quiz) => {
            if (quiz.payload.questions.length > 0 && quiz.payload.questions[0].question.length > 0 && quiz.payload.questions[0].answer.length > 0) {
                window.open(`/app#/preview/${quiz.meta.profileId}/${quiz.uuid}`, 'preview');
            }
            else {
                swal('Whoops', 'You need to have at least one question in order to play this quiz');
            }
        });

    }

    handleAssign(){
        var quiz = this.props.quiz;
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}/assign`);
        }
    }
    handleDelete(){
        var quiz = this.props.quiz;
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
    }
    render () : any {
        return (
            <div>

                <CQPublishQuiz className="cq-quizzes__button--publish" quiz={this.props.quiz}/>

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

            </div>

        );
    }
}
CQQuizzesProfile.propTypes = {
    quiz: PropTypes.object
};

export default CQQuizzesProfile;
