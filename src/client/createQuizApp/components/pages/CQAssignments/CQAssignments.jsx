/* @flow */
import React from 'react';

import {
    router
} from './../../../config';

import {
    CQPageTemplate,
    CQLink
} from './../../../components';


import { GroupActions } from './../../../actions';
import {
    GroupStore,
    TopicStore,
    QuizStore,
    MeStore
}  from './../../../stores';

import type {
    Group,
    GroupContent,
    Quiz,
} from './../../../../../types';

type State = {
    groups: Array<Group>;
    groupsContent: Array<GroupContent>;
    quizzes: Array<Quiz>;
    publicQuizzes: Array<Quiz>;
}
var CQAssignments = React.createClass({

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

    getState: function() : State {
        var groups = GroupStore.getGroups();
        var groupsContent = GroupStore.getGroupsContent();
        var quizzes = QuizStore.getQuizzes();
        var publicQuizzes = QuizStore.getPublicQuizzes();

        var newState = { groups, groupsContent, quizzes, publicQuizzes };

        return newState;

    },

    _getAssignments: function(groupCode : string) : Array<Quiz>{
        var selectPublicQuiz = (quizId : string) => {
            if (typeof this.state.publicQuizzes !== 'object'){
                return [];
            }
            var quizFound;
        };
        // console.log('checking', groupCode);
        if (this.state.groupsContent && this.state.quizzes){

            var quizIds = this.state.groupsContent.map(c => {
                if (c.groupCode === groupCode) {
                    return c.contentId;
                }
            });

            quizIds = quizIds.filter(q => q !== undefined);

            var quizzes = this.state.quizzes.filter(function(q){
                return quizIds.indexOf(q.uuid) !== -1;
            });

            return quizzes;
        }
        return [];
    },

    onChange: function(){
        this.setState(this.getState());
    },

    handleUnpublish: function(quizId : string, groupCode : string ){
        console.log('about to unpublish', quizId, groupCode);
        GroupActions.unpublishAssignment(quizId, groupCode);
    },

    handlePremium: function(assignment : Object, classN : Object){
        console.log("BEING HANDLED");
        if(MeStore.state.attributes.accountType === 1) {
            router.setRoute(`/quiz/published/${assignment.uuid}/${classN.code}/info`);
        }
        else {
            swal(
                {
                    title: 'You can view all your quizzes and track progress with the Unlimited version',
                    text: `and a whole lot more, including
                        unlimited quizzes and
                        unlimited classes`,

                confirmButtonText: 'Plans and pricing',
                showCancelButton: true,
                cancelButtonText: 'Close',
                html: true,
                allowOutsideClick:true},
                ()=>{
                    router.setRoute('/quiz/premium');
                }
            );
        }
    },

    render: function() {

        var editClass = "";

        if (this.state.groups.length > 0) {
            var dashboard = `${this.state.groups[0].link}/dashboard/list`;
            editClass = (
                <a href={dashboard} target="_blank" className="btn btn-info pull-right">
                    Edit Classes
                </a>
            );
        }


        return (
            <CQPageTemplate className="cq-container cq-classes">
                <h2 className="cq-classes__header">
                    <i className="fa fa-users"/> Your Classes
                    {editClass}
                </h2>
                <p>Here are your classes. You can click on "Open Game" to see live dashboard and reports for that quiz.</p>

                    {this.state.groups.map(classN => {
                        let fulllink = classN.link + 'one';
                        var noQuizzes;

                        if (this._getAssignments(classN.code).length === 0) {
                            noQuizzes = (<div className="row">
                                <div className="cq-clas">
                                    <p>You don't have any quizzes assigned to this class.</p>
                                </div>
                            </div>);
                        }

                        return (

                            <div className="cq-classes__class">
                                <h3 className="cq-classes__class__name">
                                    {classN.name}
                                    <a href={fulllink} target="_blank" className="btn btn-info pull-right">
                                        Open {classN.name} Zzish Dashboard
                                    </a>
                                </h3>
                                <p className="cq-classes__class__code" ng-style="color: #2a7ed0; font-size: 16px">
                                    Your Class Code: {classN.code}
                                </p><br/>
                                    {noQuizzes}
                                    {this._getAssignments(classN.code).map(assignment =>{
                                        return (
                                            <div className="cq-classes__class__assignment">
                                                <div className="cq-classes__class__assignment__name">
                                                    <h4>{assignment.meta.name}</h4>
                                                </div>
                                                <div className="cq-classes__class__assignment__topic">
                                                    <h4>{TopicStore.getTopicName(assignment.meta.categoryId)}</h4>
                                                </div>
                                                <div className="cq-classes__class__assignment__info">
                                                    <button
                                                        className="btn btn-default" onClick={this.handlePremium.bind(this, assignment, classN)} >
                                                        Open Game
                                                    </button>
                                                </div>
                                                <div className="cq-classes__class__assignment__unassign">
                                                    <button
                                                        onClick={this.handleUnpublish.bind(this, assignment.uuid, classN.code)}
                                                        className="btn btn-danger">
                                                        Unassign
                                                    </button>
                                                </div>
                                            </div>

                                        );
                                    })}

                            </div>
                        );
                    })}
            </CQPageTemplate>
        );
    }

});

module.exports = CQAssignments;
