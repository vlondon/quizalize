/* flow */
import { QuizStore } from './../stores';

var importFileParser = function(data: string, format: string){

    var processDoodleMath = function(data: string): Array<Question> {
        let lines = data.trim().split('\n');
        let columns = lines.splice(0, 1)[0].split('\t');
        let processedData = {};
        // lines.map(function (line, index) {
        for (let index = 0; index < lines.length; index++) {
            let line = lines[index];
            let q = line.split('\t');
            let question = {};
            let newQuestion = QuizStore.getQuestion("", 0);
            for (let i = 0; i < columns.length; i++) {
                question[columns[i]] = q[i];
            }
            question.options = [question.A, question.B, question.C, question.D];
            newQuestion.question = question.Question;
            switch (question.QuestionType) {
                case "T/F":
                    newQuestion.answer = `boolean://${question.options[0].toLowerCase()}`;
                    break;
                case "Multiple choice":
                    newQuestion.answer = question.options.splice(0, 1)[0];
                    newQuestion.alternatives = question.options;
                    break;
                case "Text":
                    newQuestion.answer = `freetext://${question.options[0]}`;
                    break;
                case "Sorting6":
                case "Sorting":
                    newQuestion.answer = `sorting://${question.options.filter(o => o).join(":")}`;
                    break;
                case "Linking":
                    newQuestion.answer = `linking://${question.options.filter(o => o).join(":")}`;
                    break;
            }
            if (!processedData[question.ConceptId]) {
                processedData[question.ConceptId] = {questions: []};
            }
            processedData[question.ConceptId].questions.push(newQuestion);
        }
        return processedData;
    };
    if (format == "doodlemath") {
        return processDoodleMath(data);
    }
    return [];
};

export default importFileParser;
