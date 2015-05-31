var AppDispatcher       = require('createQuizApp/flux/dispatcher/CQDispatcher');
var GroupConstants      = require('createQuizApp/flux/constants/GroupConstants');
var GroupApi            = require('createQuizApp/flux/actions/api/GroupApi');
var Promise             = require('es6-promise').Promise;
var UserStore           = require('createQuizApp/flux/stores/UserStore');
// var uuid                = require('node-uuid');

var shouldLoadGroups = true;

var GroupActions = {

    loadGroups: function(){

        if (!shouldLoadGroups){
            console.warn('groups already loading, aborting');
            return;
        }
        shouldLoadGroups = false;
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

    unpublishQuiz: function(quizId, groupCode){
        shouldLoadGroups = true;
        console.log('about to unpublish quizId, groupCode');
        GroupApi.unpublishQuiz(quizId, groupCode)
            .then(() => {
                // Update Content Id
                this.loadGroups();
            });
    },

    publishNewAssignment: function(quizId, groupName) {
        shouldLoadGroups = true;
        return new Promise(function(resolve, reject){

            GroupApi.publishNewAssignment(quizId, groupName)
                .then((response) => {
                    AppDispatcher.dispatch({
                        actionType: GroupConstants.NEW_GROUP_PUBLISHED,
                        payload: response
                    });

                    resolve(response);
                })
                .catch(reject);
        });
    },

    publishAssignment: function(quizId, code) {
        shouldLoadGroups = true;
        return new Promise(function(resolve, reject){

            GroupApi.publishAssignment(quizId, code)
                .then((response) => {
                    AppDispatcher.dispatch({
                        actionType: GroupConstants.ASSIGMENT_PUBLISHED,
                        payload: response
                    });

                    resolve(response);
                })
                .catch(reject);
        });
    }




};


module.exports = GroupActions;
