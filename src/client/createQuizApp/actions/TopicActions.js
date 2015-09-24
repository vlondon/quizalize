var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants      = require('createQuizApp/constants/TopicConstants');
var QuizApi             = require('createQuizApp/actions/api/QuizApi');


var TopicActions = {

    createTemporaryTopic: function(topic){
        AppDispatcher.dispatch({
            actionType: TopicConstants.TEMPORARY_TOPIC_ADDED,
            payload: topic
        });
    },

    createTopic: function(topic){
        var putTopic = QuizApi.putTopic(topic);
        putTopic
            .catch(function(er){
                console.error('There has been an error', er);
            });
        AppDispatcher.dispatch({
            actionType: TopicConstants.TOPIC_ADDED,
            payload: topic
        });
        return putTopic;
    },

    loadPublicTopics: function(){
        QuizApi.getTopics()
            .then(function(topics){
                AppDispatcher.dispatch({
                    actionType: TopicConstants.PUBLIC_TOPICS_LOADED,
                    payload: topics
                });
            })
            .catch(function(error){
                console.error('there has been an error', error);
            });
    },


    loadUserTopics: function(){
        QuizApi.getUserTopics()
            .then(function(topics){
                AppDispatcher.dispatch({
                    actionType: TopicConstants.TOPICS_LOADED,
                    payload: topics
                });
            })
            .catch(function(error){
                console.error('there has been an error', error);
            });
    }
};


module.exports = TopicActions;
