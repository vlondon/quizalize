var QuizFormat = {

    moveSettingsToQuestion: function(quiz) {
        var converted = false;
        if (quiz.settings.latexEnabled) {
            quiz.questions.forEach(question => {
                question.latexEnabled = quiz.settings.latexEnabled || false;
                delete quiz.settings.latexEnabled;
            });
            converted = true;
        }

        if (quiz.settings.imageEnabled) {
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
        return quiz;

    },


    process: function(quiz){
        quiz = this.moveSettingsToQuestion(quiz);
        return quiz;
    }
};

module.exports = QuizFormat;
