var uuid = require('node-uuid');
var assign = require('object-assign');
var QuizFormat = {

    allQuestionsWithId: function allQuestionsWithId(quiz) {
        console.info('Running quiz format');
        var converted = false;

        quiz.payload.questions.forEach(function (question) {
            if (!question.uuid) {
                question.uuid = uuid.v4();
                converted = true;
            }
        });

        if (quiz.meta.created === undefined){
            converted = true;
        }

        if (quiz.meta.updated === undefined){
            converted = true;
        }
        return { quiz: quiz, converted: converted };
    },

    moveSettingsToQuestion: function moveSettingsToQuestion(quiz) {
        var converted = 0;
        var newMeta;

        if (quiz.meta === undefined) {
            quiz.meta = {};
            converted = 1;
            console.log('converted', 1);
        }
        if (quiz.payload === undefined || quiz.payload === null) {
            quiz.payload = {};
            converted = 2;
            console.log('converted', 2);
        }

        if (quiz.payload.questions === undefined || quiz.payload.questions === null) {
            converted = 3;
            console.log('converted', 3);
            quiz.payload.questions = [];
        }
        // quiz.payload.questions = quiz.payload.questions || [];

        if (quiz.payload.settings && quiz.payload.settings.latexEnabled) {
            quiz.payload.questions.forEach(function (question) {
                question.latexEnabled = quiz.payload.settings.latexEnabled || false;
            });
            delete quiz.payload.settings.latexEnabled;
            converted = 4;
            console.log('converted', 4);
        }

        if (quiz.payload.settings && quiz.payload.settings.imageEnabled) {
            quiz.payload.questions.forEach(function (question) {
                question.imageEnabled = quiz.payload.settings.imageEnabled || false;
            });
            delete quiz.payload.settings.imageEnabled;
            converted = 5;
            console.log('converted', 5);
        }

        if (quiz.payload.latexEnabled !== undefined) {
            quiz.payload.questions.forEach(function (question) {
                question.latexEnabled = quiz.payload.latexEnabled || false;
            });
            converted = 6;
            console.log('converted', 6);
            delete quiz.payload.latexEnabled;
        }

        if (quiz.payload.imageEnabled !== undefined) {
            quiz.payload.questions.forEach(function (question) {
                question.imageEnabled = quiz.payload.imageEnabled || false;
            });
            converted = 7;
            console.log('converted', 7);
            delete quiz.payload.imageEnabled;
        }
        if (quiz.payload.settings) {
            newMeta = assign({}, quiz.meta, quiz.payload.settings);
            quiz.meta = newMeta;
            converted = 8;
            console.log('converted', 8);
            delete quiz.payload.settings;
        }


        quiz.payload.questions.forEach(function (question) {
            if (question.imageUrl) {
                delete question.imageUrl;
                converted = 9;
                console.log('converted', 9);
            }
        });


        if (quiz.meta.Description && !quiz.meta.description) {
            quiz.meta.description = quiz.meta.Description;
            converted = 10;
            console.log('converted', 10);
            delete quiz.meta.Description;
        }
        if (quiz.payload.name && !quiz.meta.name) {
            quiz.meta.name = quiz.payload.name;
            delete quiz.payload.name;
            console.log('converted', 11);
            converted = 11;
        }



        if (quiz.payload.categoryId && !quiz.meta.categoryId) {
            quiz.meta.categoryId = quiz.payload.categoryId;
            delete quiz.payload.categoryId;
            converted = '11a';
            console.log('converted', converted);
        }

        // profile id should be in meta
        if (quiz.payload.profileId){
            quiz.meta.profileId = quiz.payload.profileId;
            delete quiz.payload.profileId;
            converted = 12;
            console.log('converted', 12);
        }

        // profile id should be in meta
        if (quiz.profileId && quiz.meta.profileId === undefined){
            quiz.meta.profileId = quiz.profileId;
            delete quiz.payload.profileId;
            converted = '12a';
            console.log('converted', converted);
        }

        // subject id should be in meta
        if (quiz.payload.subject){
            quiz.meta.subject = quiz.payload.subject;
            delete quiz.payload.subject;
            converted = 13;
            console.log('converted', converted);
        }

        // category name should'nt be on the object
        if (quiz.payload.category) {
            delete quiz.payload.category;
            converted = 14;
            console.log('converted', converted);
        }

        if (quiz.payload.name) {
            delete quiz.payload.name;
            converted = 15;
            console.log('converted', converted);
        }
        // uuid should not be in payload
        if (quiz.payload.uuid) {
            delete quiz.payload.uuid;
            converted = 16;
            console.log('converted', converted);
        }


        // if (quiz.name) {
        //     delete quiz.name;
        //     converted = 17;
        //     console.log('converted', converted);
        // }
        // // uuid should not be in payload
        // if (quiz.categoryId) {
        //     delete quiz.categoryId;
        //     converted = 18;
        //     console.log('converted', converted);
        // }

        if (converted) {
            console.warn('Quiz ' + quiz.uuid + ' converted to new format ' + converted);
        } else {
            console.log('Quiz ' + quiz.uuid + ' is fine');
        }

        converted = converted > 0;

        return { quiz: quiz, converted: converted };
    },

    convert: function convert(quiz) {
        var converted;
        var result1 = this.moveSettingsToQuestion(quiz);
        var result2 = this.allQuestionsWithId(result1.quiz);

        converted = result1.converted || result2.converted;

        if (converted) {
            // console.error('There is an error on the data, resaving');
        }
        return {
            quiz: result2.quiz,
            converted: converted
        };
    },

    process: function process(quiz) {
        var result = this.moveSettingsToQuestion(quiz);
        return result.quiz;
    }
};

module.exports = QuizFormat;

// console.error('There is an error on the data, resaving');
