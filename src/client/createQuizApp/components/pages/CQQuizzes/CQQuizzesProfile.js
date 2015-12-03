/* @flow */
import React, { PropTypes } from 'react';
import { GroupStore } from './../../../stores';
import { CQPublishQuiz, CQDropdown } from './../../../components';

import { QuizActions } from './../../../actions';
import { router }  from './../../../config';

import type {Quiz} from './../../../../../types';

type Props = {
    quiz: Quiz;
}
class CQQuizzesProfile extends React.Component {
    props: Props;
    constructor(props: Props){
        super(props);
        this.handleMenuContainer = this.handleMenuContainer.bind(this);
        this.handleMenuItem = this.handleMenuItem.bind(this);
        this.handleShare = this.handleShare.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
        this.handleAssignHomework = this.handleAssignHomework.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleMenuContainer(ev : Event){
        ev.stopPropagation();
    }

    handleMenuItem(item : Object){
        item.handler();
    }

    handleShare(){
        router.setRoute(`/quiz/published/${this.props.quiz.uuid}/share`);
    }
    handleEdit(ev : Event){
        ev.stopPropagation();
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

    handleAssign(ev : Event){
        ev.stopPropagation();
        var quiz = this.props.quiz;
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}/assign`);
        }
    }

    handleAssignHomework(){
        var quiz = this.props.quiz;
        if (quiz){
            router.setRoute(`/quiz/published/${quiz.uuid}/assign?homework=true`);
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
        var moreAction = [
            {
                value: "more",
                name: "More Actions",
                handler: this.handleMenuItem,
                disabled: true
            },
            {
                value: "share",
                name: "Share",
                handler: this.handleShare
            },
            {
                value: "preview",
                name: "Preview",
                handler: this.handlePreview
            },
            {
                value: "homework",
                name: "Set as homework",
                handler: this.handleAssignHomework
            },
            {
                value: "delete",
                name: "Delete",
                handler: this.handleDelete
            },
        ];

        var actionDropDown =  (
            <span onClick={this.handleMenuContainer} className="cq-quizzes__dropdown--moreaction">
                <CQDropdown
                    values={moreAction}
                    onChange={this.handleMenuItem}
                    selected="more"/>
            </span>
        );

        return (
            <div>

                <CQPublishQuiz className="cq-quizzes__button--publish" quiz={this.props.quiz}/>

                <button className="cq-quizzes__button--edit" onClick={this.handleEdit}>
                    <span className="fa fa-pencil"></span> Edit
                </button>

                <button className="cq-quizzes__button--assign" onClick={this.handleAssign}>
                    <span className="fa fa-users"></span> Play in class
                </button>

                {actionDropDown}

            </div>

        );
        //
        // <button className="cq-quizzes__button--share" onClick={this.handleShare}>
        //     <span className="fa fa-share"></span> Share
        // </button>
        //
        // <button className="cq-quizzes__button--preview" onClick={this.handlePreview}>
        //     <span className="fa fa-search"></span> Preview
        // </button>
        //
        // <button className="cq-quizzes__button--assign" onClick={this.handleAssignHomework}>
        //     <span className="fa fa-users"></span> Set as homework
        // </button>
        //
        // <button className="cq-quizzes__button--delete" onClick={this.handleDelete}>
        //     <span className="fa fa-trash-o"></span>
        // </button>
    }
}
CQQuizzesProfile.propTypes = {
    quiz: PropTypes.object
};

export default CQQuizzesProfile;
