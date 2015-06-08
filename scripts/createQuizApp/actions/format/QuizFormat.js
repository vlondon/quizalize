var QuizFormat = {

    moveSettingsToQuestion: function(quiz) {
        var converted = false;
        if (quiz.settings) {
            quiz.questions.forEach(question => {
                question.latexEnabled = quiz.settings.latexEnabled || false;
                question.imageEnabled = quiz.settings.imageEnabled || false;
            });
            converted = true;
            delete quiz.settings;
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
        if (converted) {
            console.warn(`Quiz ${quiz.uuid} converted to new format`);
        }
        return quiz;

    },


    process: function(quiz){
        quiz = this.moveSettingsToQuestion(quiz);
        return quiz;
    }
};

module.exports = QuizFormat;
