var AppDispatcher       = require('createQuizApp/flux/dispatcher/CQDispatcher');
var GroupConstants      = require('createQuizApp/flux/constants/GroupConstants');
var GroupApi            = require('createQuizApp/flux/actions/api/GroupApi');
// var Promise             = require('es6-promise').Promise;
// var uuid                = require('node-uuid');



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
    }


};


module.exports = GroupActions;
