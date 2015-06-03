var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var GroupConstants      = require('createQuizApp/constants/GroupConstants');
var GroupApi            = require('createQuizApp/actions/api/GroupApi');
var Promise             = require('es6-promise').Promise;
var assign              = require('object-assign');


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

    unpublishQuiz: function(quizId, groupCode){

        console.log('about to unpublish quizId, groupCode');
        GroupApi.unpublishQuiz(quizId, groupCode)
            .then(() => {
                // Update Content Id
                this.loadGroups();
            });
    },

    publishNewAssignment: function(quizId, groupName) {

        return new Promise(function(resolve, reject){

            GroupApi.publishNewAssignment(quizId, groupName)
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

    publishAssignment: function(quizId, code, settings) {

        return new Promise(function(resolve, reject){
            var dataToSend = {
                access: -1,
                code
            };

            var data = assign({}, dataToSend, settings);

            GroupApi.publishAssignment(quizId, data)
                .then((response) => {
                    AppDispatcher.dispatch({
                        actionType: GroupConstants.ASSIGMENT_PUBLISHED,
                        payload: response
                    });
                    resolve(response);
                    console.log('we got response!', response);
                    this.loadGroups();
                })
                .catch(reject);
        });
    }




};
GroupActions.loadGroups();

module.exports = GroupActions;
