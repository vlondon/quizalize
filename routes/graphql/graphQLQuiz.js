var zzish = require("../../zzish");

class Quiz extends Object {
    constructor (obj){
        super(obj);
        Object.assign(this, obj);
    }
}

var performQuery = function(mongoQuery) {

    return new Promise((resolve, reject)=>{
        console.log('zzish hit');
        zzish.searchPublicContent('quiz', mongoQuery, function(err, resp){
            if (resp) {
                resolve(resp);
            } else {
                reject(error);
            }
        });
    });
};



var QuizActions = {
    getQuizById: function(uuid) {
        return new Promise(function(resolve, reject){

            zzish.getPublicContent('quiz', uuid, function(err, resp){
                if (err) {
                    reject(err);
                } else {
                    var quiz = new Quiz(resp);
                    resolve(quiz);
                }
            });
        });
    },
    getUserQuizzes: function(profileId){

        let now = Date.now();
        let lastYear = now - 365 * 7 * 24 * 60 * 60 * 1000;

        let mongoQuery = {
            updated: {
                $gt: lastYear
            },
            published: "published",
            name: {
                $regex: '', $options: 'i'
            },
            profileId

        };


        return performQuery(mongoQuery);
    }
};

export default QuizActions;
