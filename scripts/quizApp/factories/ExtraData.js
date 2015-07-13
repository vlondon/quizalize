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

                return {
                    isVideoQuiz,
                    videoSegments
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
