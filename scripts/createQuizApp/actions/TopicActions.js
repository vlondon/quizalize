var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var TopicConstants      = require('createQuizApp/constants/TopicConstants');
var QuizApi             = require('createQuizApp/actions/api/QuizApi');


var TopicActions = {

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
        QuizApi.getPublicQuizzes()
            .then(function(quizzes){
                console.log('we got', quizzes);
                AppDispatcher.dispatch({
                    actionType: TopicConstants.PUBLIC_TOPICS_LOADED,
                    payload: quizzes.categories
                });
            });
    }

};


module.exports = TopicActions;
