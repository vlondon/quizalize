/* @flow */
import AppDispatcher from './../dispatcher/CQDispatcher';
import {GroupConstants} from './../constants';
import {GroupApi} from './../actions/api';
import {GroupStore} from './../stores';
import {router} from './../config';

var GroupActions = {

    loadGroups: function(){
        var groups = GroupApi.getGroups();
        var groupsContent = GroupApi.getGroupContents();


        Promise.all([groups, groupsContent])
            .then( value => {

                // let's stitch quizzes to their topic
                var groupsLoaded = value[0];
                var groupsContentLoaded = value[1];

                AppDispatcher.dispatch({
                    actionType: GroupConstants.GROUPS_LOADED,
                    payload: {
                        groups: groupsLoaded,
                        groupsContent: groupsContentLoaded
                    }
                });
            });

    },

    createFirstAssignment: function(quizId : string){
        // console.log('createFirstAssignment', quizId);
        // make sure we don't have any class created:
        router.setRoute(`/quiz/published/${quizId}/assign`, true);
        // var groups = GroupStore.getGroups();
        // if (groups.length === 0){
        //
        //     this.publishNewAssignment(quizId, 'Your first class')
        //         .then(classResponse => {
        //             console.log('class', classResponse);
        //             router.setRoute(`/quiz/published/${quizId}/${classResponse.groupCode}/info`, true);
        //
        //         });
        // } else {
        //     console.log('a class already exists');
        //
        // }
    },

    unpublishAssignment: function(quizId: string, groupCode : string){

        GroupApi.unpublishQuiz(quizId, groupCode)
            .then(() => {
                // Update Content Id
                this.loadGroups();
            });
    },

    publishNewAssignment: function(quizId : string, groupName : string) : Promise {

        return new Promise((resolve, reject) => {
           var dataToSend = {
                access: -1,
                groupName
            };

            GroupApi.publishNewAssignment(quizId, dataToSend)
                .then((response) => {
                    AppDispatcher.dispatch({
                        actionType: GroupConstants.NEW_GROUP_PUBLISHED,
                        payload: response
                    });
                    this.loadGroups();
                    resolve(response);
                })
                .catch(reject);
        });
    },

    publishAssignment: function(quizId : string, code : string , settings : Object ) : Promise {

        return new Promise((resolve, reject) => {
            var UserStore = require('./../stores/UserStore');
            var dataToSend = {
                access: -1,
                code
            };

            var data = Object.assign({}, settings, dataToSend);

            GroupApi.publishAssignment(quizId, data)
                .then((response) => {
                    AppDispatcher.dispatch({
                        actionType: GroupConstants.ASSIGMENT_PUBLISHED,
                        payload: response
                    });
                    this.loadGroups();
                    resolve(response);
                })
                .catch(reject);
        });
    }




};


module.exports = GroupActions;
