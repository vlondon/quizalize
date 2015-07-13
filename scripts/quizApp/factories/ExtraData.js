var settings = require('quizApp/config/settings');
angular.module('quizApp')
    .factory('ExtraData', function($http, $q, $log){

        if(typeof zzish === 'undefined') {
            $log.error("Require zzish.js to use zzish");
        }



        var ExtraData = {

            videoQuizHandler: function(quiz){
                var isVideoQuiz = quiz && quiz.meta.name.split('|').length > 0;
                var videoSegments = quiz.meta.name.split('|');
                videoSegments.shift();
                videoSegments = videoSegments.map(v => parseInt(v, 10));


                var answerSnippets = quiz.payload.questions.map( q => {
                    var questionArray = q.question.split('|');
                    var start = questionArray[1] ? parseInt(questionArray[1], 10) : undefined;
                    var end = questionArray[2] ? parseInt(questionArray[2], 10) : undefined;
                    return { start, end };
                });

                quiz.payload.questions.forEach(q=>{
                    q.question = q.question.split('|')[0];
                })

                return {
                    extra: {
                        isVideoQuiz,
                        videoSegments,
                        answerSnippets
                    },
                    quiz
                };
            },

            getLeaderBoard: function(quizId, activityId){

                var formatLeaderboard = function(results) {

                    results.sort((a, b) => { return a.score < b.score ? 1 : -1; });
                    results = results.filter(r => r.score !== null);

                    var scoreBoard = results.map( result => {
                        return {
                            score: result.score,
                            name: result.profile.name || 'Anonymous',
                            uuid: result.uuid
                        };
                    });
                    return scoreBoard;
                };

                var uuid = quizId;
                var deferred = $q.defer();

                var callback = function(err, response){
                    console.log('we got ', response);
                    if (err) {
                        deferred.reject(err);
                    } else {

                        deferred.resolve(formatLeaderboard(response));
                    }
                };

                zzish.getPublicContentResults(settings.QUIZ_CONTENT_TYPE, uuid, callback);

                return deferred.promise;
            }
        };

        return ExtraData;
    });
