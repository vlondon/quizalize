import zzish from 'zzishsdk';
import logger from './../../logger';
import Immutable, {Map} from 'immutable';

const QUIZ_CONTENT_TYPE = 'quiz';
const APP_CONTENT_TYPE = 'app';

var quizzes = Map();
var apps = Map();
var topics = Map();

var loadContent = function(){
    var mongoQuery = {
        updated: {
            $gt: 1
        },
        published: "published",
        name: {
            $regex: '', $options: 'i'
        }
    };

    zzish.searchPublicContent(QUIZ_CONTENT_TYPE, mongoQuery, function(err, response){
        // response = response.splice(0, 4);
        var quizzesTemp = {};
        response.forEach((quiz)=> quizzesTemp[quiz.uuid] = quiz );
        quizzes = Immutable.fromJS(quizzesTemp);

    });

    zzish.searchPublicContent(APP_CONTENT_TYPE, mongoQuery, function(err, response){
        // response = response.splice(0, 4);
        var appsTemp = {};
        response.forEach((app)=> appsTemp[app.uuid] = app );
        apps = Immutable.fromJS(appsTemp);

    });

    zzish.listPublicContent(QUIZ_CONTENT_TYPE, function(err, resp){
        console.log('topics', Object.keys(resp));
        var topicsTemp = {};


        ['categories', 'pcategories', 'psubjects'].forEach((key)=>{
            var topicList = resp[key];
            topicList.forEach(topic=> topicsTemp[topic.uuid] = topic );

        });
        topics = Immutable.fromJS(topicsTemp);
        console.log('topicList', topics.size);
        setTimeout(function(){

            search.quiz('musical hist');
        }, 2000);
        // if (!handleError(err, res)) {
        //     res.send(resp);
        // }
    });
};

loadContent();

let search = {
    quiz: function(searchString){
        logger.info('Searching for', searchString);
        var topicsFound = topics.filter(value => value.get('name').toLowerCase().indexOf(searchString.toLowerCase()) !== -1 );

        var quizzesFoundWithTheSubtopic = quizzes.filter(quiz=>{
            var categoryMatch = topicsFound.find((t, uuid) => {
                console.log('uuid topic', uuid, quiz.get('meta').get('categoryId'), quiz.get('meta').get('name'));
                if (quiz.get('meta').get('publicCategoryId') && uuid === quiz.get('meta').get('publicCategoryId')) {
                    return true;
                }
                // console.log('t.get', uuid, quiz.get('meta').get('categoryId'), uuid === quiz.get('meta').get('categoryId'));
                return uuid === quiz.get('meta').get('categoryId');
            });


            console.log('category match', categoryMatch);
            // var publicCategoryId = quiz.publicCategoryId;
            // quiz.get('')
            return categoryMatch !== undefined  ;
        });
        logger.info('got the following topics', topicsFound, quizzesFoundWithTheSubtopic);
        // var topicResults =
    }
};

export default search;
