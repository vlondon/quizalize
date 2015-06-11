var uuid = require('node-uuid');
var QuizFormat = {

    allQuestionsWithId: function(quiz){
        var converted = false;

        quiz.payload.questions.forEach( question => {
            if (!question.uuid) {
                question.uuid = uuid.v4();
                converted = true;
            }
        });

        return { quiz, converted };
    },

    moveSettingsToQuestion: function(quiz) {
        var converted = 0;
        if (quiz.meta === undefined) {
            quiz.meta = {};
            converted = 1;
        }
        if (quiz.payload === undefined) {
            quiz.payload = {};
            converted = 2;
        }
        if (quiz.payload.questions === undefined) {
            converted = 3;
            quiz.payload.questions = [];
        }
        quiz.payload.questions = quiz.payload.questions || [];

        if (quiz.settings && quiz.settings.latexEnabled) {
            quiz.questions.forEach(question => {
                question.latexEnabled = quiz.settings.latexEnabled || false;
                delete quiz.settings.latexEnabled;
            });
            converted = 4;
        }

        if (quiz.settings && quiz.settings.imageEnabled) {
            quiz.questions.forEach(question => {
                question.imageEnabled = quiz.settings.imageEnabled || false;
                delete quiz.settings.imageEnabled;

            });
            converted = 5;
        }


        if (quiz.latexEnabled) {
            quiz.questions.forEach(question => {
                question.latexEnabled = quiz.latexEnabled || false;
            });
            converted = 6;
            delete quiz.latexEnabled;
        }

        if (quiz.imageEnabled) {
            quiz.questions.forEach(question => {
                question.imageEnabled = quiz.imageEnabled || false;
            });
            converted = 7;
            delete quiz.imageEnabled;
        }
        if (quiz.settings) {
            for (var i in quiz.settings) {
                quiz.meta[i] = quiz.settings[i];
            }
            converted = 8;
            delete quiz.settings;
        }
        quiz.payload.questions.forEach(question => {
            if (question.imageUrl) {
                delete question.imageUrl;
                converted = 9;
            }
        });
        if (quiz.meta && quiz.meta.Description && !quiz.meta.description) {
            quiz.meta.description = quiz.meta.Description;
            converted = 10;
        }
        if (quiz.name && !quiz.meta.name) {
            quiz.meta.name = quiz.name;
        }
        if (converted) {
            console.warn(`Quiz ${quiz.uuid} converted to new format ${converted}`);
        }
        converted = converted > 0;
        return { quiz, converted };

    },

    convert: function(quiz){
        var converted;
        var result1 = this.moveSettingsToQuestion(quiz);
        var result2 = this.allQuestionsWithId(result1.quiz);

        converted = result1.converted || result2.converted;

        if (converted) {
            console.error('There is an error on the data, resaving');
        }
        return {
            quiz: result2.quiz,
            converted
        };
    },


    process: function(quiz){
        var result = this.moveSettingsToQuestion(quiz);
        return result.quiz;
    }
};

module.exports = QuizFormat;
