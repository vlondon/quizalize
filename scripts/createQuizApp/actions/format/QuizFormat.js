var uuid = require('node-uuid');
var QuizFormat = {

    allQuestionsWithId: function(quiz){
        var converted = false;

        quiz.questions.forEach( question => {
            if (!question.uuid) {
                question.uuid = uuid.v4();
                converted = true;
            }
        });

        return { quiz, converted };
    },

    moveSettingsToQuestion: function(quiz) {

        var converted = false;
        if (quiz.settings && quiz.settings.latexEnabled) {
            quiz.questions.forEach(question => {
                question.latexEnabled = quiz.settings.latexEnabled || false;
                delete quiz.settings.latexEnabled;
            });
            converted = true;
        }

        if (quiz.settings && quiz.settings.imageEnabled) {
            quiz.questions.forEach(question => {
                question.imageEnabled = quiz.settings.imageEnabled || false;
                delete quiz.settings.imageEnabled;

            });
            converted = true;
        }


        if (quiz.latexEnabled) {

            quiz.questions.forEach(question => {
                question.latexEnabled = quiz.latexEnabled || false;
            });
            converted = true;
            delete quiz.latexEnabled;
        }

        if (quiz.imageEnabled) {
            quiz.questions.forEach(question => {
                question.imageEnabled = quiz.imageEnabled || false;
            });
            converted = true;
            delete quiz.imageEnabled;
        }
        quiz.questions.forEach(question => {
            if (question.imageUrl) {
                delete question.imageUrl;
                converted = true;
            }
        });
        if (converted) {
            console.warn(`Quiz ${quiz.uuid} converted to new format`);
        }
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
