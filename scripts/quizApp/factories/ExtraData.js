angular.module('quizApp')
    .factory('ExtraData', function($http, $q, $log){

        if(typeof zzish === 'undefined') {
            $log.error("Require zzish.js to use zzish");
        }



        var ExtraData = {

            getLeaderBoard: function(quizId, activityId){

                var formatLeaderboard = function(results) {

                    results.sort((a, b) => { return a.score < b.score ? 1 : -1; });
                    results = results.filter(r => r.score !== null);

                    var scoreBoard = results.map( result => {
                        return {
                            score: result.score,
                            name: result.profile.name || 'Anonymous'
                        };
                    });
                    return scoreBoard;
                };

                var uuid = quizId;
                var deferred = $q.defer();

                var callback = function(err, response){
                    if (err) {
                        deferred.reject(err);
                    } else {

                        deferred.resolve(formatLeaderboard(response));
                    }
                };

                zzish.getPublicContentResults(uuid, callback);

                return deferred.promise;
            }
        };

        return ExtraData;
    });
