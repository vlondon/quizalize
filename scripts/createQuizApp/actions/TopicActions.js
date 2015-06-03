var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants      = require('createQuizApp/constants/TopicConstants');
var QuizApi             = require('createQuizApp/actions/api/QuizApi');


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
