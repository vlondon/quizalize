/* @flow */
import zzish from 'zzishsdk';
import logger from './../../logger';
import Immutable, {Map} from 'immutable';

const QUIZ_CONTENT_TYPE = 'quiz';
const APP_CONTENT_TYPE = 'app';

let quizzes = Map();
let apps = Map();
let topics = Map();


let loadContent = function(){
    let mongoQuery = {
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
        let quizzesTemp = {};
        response.forEach((quiz)=> quizzesTemp[quiz.uuid] = quiz );
        quizzes = sortQuizzes(Immutable.fromJS(quizzesTemp));

    });

    zzish.searchPublicContent(APP_CONTENT_TYPE, mongoQuery, function(err, response){
        // response = response.splice(0, 4);
        let appsTemp = {};
        response.forEach((app)=> appsTemp[app.uuid] = app );
        apps = Immutable.fromJS(appsTemp);

    });

    zzish.listPublicContent(QUIZ_CONTENT_TYPE, function(err, resp){
        // console.log('topics', Object.keys(resp));

        let topicsTemp = {};
        let topicsArray = [];

        ['categories', 'pcategories', 'psubjects'].forEach((key)=>{
            let topicList = resp[key];
            topicList.forEach(topic => topicsArray.push(topic));
        });

        topicsArray.forEach(topic=>{

            if (
                topic.parentCategoryId !== null &&
                topic.parentCategoryId !== undefined &&
                topic.parentCategoryId !== '-1'
            ){
                let parentTopic = topicsArray.filter(t=> t.uuid === topic.parentCategoryId);
                topic.fullName = parentTopic[0].name + ' > ' + topic.name;
            } else if (topic.subjectId){
                let parentSubject = topicsArray.filter(t=> t.uuid === topic.subjectId);
                topic.fullName = parentSubject[0].name + ' > ' + topic.name;
            } else {
                topic.fullName = topic.name;
            }


            topicsTemp[topic.uuid] = topic;
        });
        topics = Immutable.fromJS(topicsTemp);

    });
};

loadContent();
setInterval(loadContent, 60 * 60 * 1000);

let sortQuizzes = function(arrayOfQuizzes){
    arrayOfQuizzes.sort((q1, q2)=>{
        let q1meta = q1.get('meta');
        let q2meta = q2.get('meta');
        let cr1 = q1meta && q1meta.get('contentRating') ? q1meta.get('contentRating') : 5;
        let cr2 = q2meta && q2meta.get('contentRating') ? q2meta.get('contentRating') : 5;
        let time1 = q1meta.get('updated');
        let time2 = q2meta.get('updated');
        console.log('cr1', cr1);
        console.log('cr2', cr2);
        if (cr1 > cr2) {
            return 1;
        } else if (cr1 === cr2) {
            return (time1 > time2) ? 1 : -1;
        } else {
            return -1;
        }
    });
    return arrayOfQuizzes;
};

let search = {
    quiz: function(searchString: string) : Array<Object> {
        let start = process.hrtime();

        if (searchString === ''){
            let result = quizzes.toArray();
            let end = process.hrtime(start);
            logger.info('Search for emtpy string', end[1]/1000, result.length);
            return (result);
        }

        let topicsFound = topics.filter(value => value.get('fullName').toLowerCase().indexOf(searchString.toLowerCase()) !== -1 );

        let quizzesFoundWithTheSubtopic = quizzes.filter(quiz=>{
            let categoryMatch = topicsFound.find((t, uuid) => {
                // console.log('uuid topic', uuid, quiz.get('meta').get('categoryId'), quiz.get('meta').get('name'));
                if (
                    quiz.get('meta').get('publicCategoryId') &&
                    uuid === quiz.get('meta').get('publicCategoryId')
                ) {
                    return true;
                }
                // console.log('t.get', uuid, quiz.get('meta').get('categoryId'), uuid === quiz.get('meta').get('categoryId'));
                return uuid === quiz.get('meta').get('categoryId');
            });


            // console.log('category match', categoryMatch);
            // let publicCategoryId = quiz.publicCategoryId;
            // quiz.get('')
            return categoryMatch !== undefined;
        });

        let quizzesFoundWithName = quizzes.filter(quiz=>{
            return quiz.get('meta').get('name').toLowerCase().indexOf(searchString.toLowerCase()) !== -1;
        });

        let result = [];
        quizzesFoundWithName.forEach(quiz=> result.push(quiz));
        quizzesFoundWithTheSubtopic.forEach(quiz=>{
            // logger.info('quiz??', quiz.get('uuid'), key);
            let duplicate = result.filter(r=> r.get('uuid') === quiz.get('uuid'))[0] !== undefined;
            if (!duplicate){
                result.push(quiz);
            }
        });




        // logger.info('got the following topics', topicsFound.count());
        // logger.info('quizzesFoundWithTheSubtopic', quizzesFoundWithTheSubtopic);
        // logger.info('quizzesFoundWithName', quizzesFoundWithName.count());
        let end = process.hrtime(start);
        logger.info('Search for', searchString, end[1]/1000, result.length);
        return (result);
        // let topicResults =
    },
    app: (searchString : string) : Array<Object> =>  {
        let quizzes = search.quiz(searchString);
        logger.trace('quizzes', quizzes.length);
        let appsWithQuiz = [];
        quizzes.forEach(quiz=>{
            apps.forEach(app=>{
                let quizzesIds = app.get('meta').get('quizzes');
                let hasQuiz = quizzesIds.indexOf(quiz.get('uuid')) !== -1;
                let appAlreadyAdded = appsWithQuiz.filter(a=> a.get('uuid') === app.get('uuid'))[0] !== undefined;
                if (hasQuiz && !appAlreadyAdded) { appsWithQuiz.push(app); }

            });
        });

        logger.info('apps with quiz', appsWithQuiz.length);
        return appsWithQuiz;
    }
};

export default search;
