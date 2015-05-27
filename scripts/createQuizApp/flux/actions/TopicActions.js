var AppDispatcher       = require('createQuizApp/flux/dispatcher/CQDispatcher');
var TopicConstants      = require('createQuizApp/flux/constants/TopicConstants');
var QuizApi             = require('createQuizApp/flux/actions/api/QuizApi');


var TopicActions = {

    createTopic: function(topic){
        var putTopic = QuizApi.putTopic(topic);
        putTopic
            .then(function(){
                AppDispatcher.dispatch({
                    actionType: TopicConstants.TOPIC_ADDED,
                    payload: topic
                });
            });
        return putTopic;
    }

};


module.exports = TopicActions;
