var AppDispatcher       = require('createQuizApp/dispatcher/CQDispatcher');
var AnalyticsConstants  = require('createQuizApp/constants/AnalyticsConstants');

var _marketplace = [];
var MarketplaceStore = {

};

// Register callback to handle all updates
AppDispatcher.register(function(action) {

    switch(action.actionType) {
        case QuizConstants.QUIZZES_LOADED:
            _quizzes = action.payload.quizzes;
            _topics = action.payload.topics;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_LOADED:
            AppDispatcher.waitFor([
                TopicStore.dispatchToken
            ]);
            var quiz = action.payload;
            _fullQuizzes[quiz.uuid] = quiz;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZZES_PUBLIC_LOADED:
            _publicQuizzes = action.payload;
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_DELETED:
            var quizIdToBeDeleted = action.payload;
            var quizToBeDeleted = _quizzes.filter(q => q.uuid === quizIdToBeDeleted)[0];
            _quizzes.splice(_quizzes.indexOf(quizToBeDeleted), 1);
            QuizStore.emitChange();
            break;

        case QuizConstants.QUIZ_ADDED:
            var quizAdded = action.payload;
            _fullQuizzes[quizAdded.uuid] = quizAdded;
            // I can't update quizzes yet because the category needs to be set up
            // var i = _quizzes.filter(q=> q.uuid === quizAdded.uuid);
            // if (i.length === 0){
            //     _quizzes.push(quizAdded);
            // }
            QuizStore.emitChange();
            break;


        default:
            // no op
    }
});

module.exports = MarketplaceStore;
