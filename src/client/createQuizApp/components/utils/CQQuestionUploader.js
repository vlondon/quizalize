/* @flow */
import React from 'react';

class CQQuestionUploader extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {};

        this.handleFile = this.handleFile.bind(this);
    }

    // when a file is passed to the input field, retrieve the contents as a
    // base64-encoded data URI and save it to the component's state
    handleFile(ev:Object){
        if (ev.target.files[0].size <= 1048576){
            var reader = new FileReader();
            reader.onload = (upload) =>{
                var data = upload.target.result;
                this.setState({ data });
                this.props.onQuestionData(data);
                this.props.onQuestionData(this.processData(data));
            };

            var dataFile = ev.target.files[0];

            this.setState({ dataFile });
            this.props.onQuestionFile(dataFile);
            reader.readAsText(dataFile);
        }
        else {
            window.swal("Oops...", "The file you are trying to upload it too large. The maximum size for your file is 1MB", "error");
        }


    }


    processData (data: string): Question {
        if (this.props.format == "doodlemath") {
            this.processDoodleMath(data);
        }
    }

    processDoodleMath (data: string): Question {
        let lines = data.trim().split('\n');
        let columns = lines.splice(0, 1)[0].split('\t');
        let processedData = lines.map(function (line) {
            let q = line.split('\t');
            let question = {};
            let newQuestion = {}; //Todo new question
            for (let i = 0; i < columns.length; i++) {
                question[columns[i]] = q[i];
            }
            question.options = [question.A, question.B, question.C, question.D];
            newQuestion.question = question.Question;
            switch (question.QuestionType) {
                case "T/F":
                    newQuestion.answer = "boolean://" + question.options[0].toLowerCase();
                    break;
                case "Multiple choice":
                    newQuestion.answer = question.options.splice(0, 1)[0];
                    newQuestion.alternatives = question.options;
                    break;
                case "Text":
                    newQuestion.answer = question.options[0];
                    break;
                case "Sorting6":
                case "Sorting":
                    newQuestion.answer = question.options.join(":");
                    break;
                case "Linking":
                    newQuestion.answer = question.options.join(":");
                    break;
            }
        });
        return processedData;
    }

    render () : any {
        return (
            <input type="file"
                ref="importFile"
                accept="*"
                id={this.props.id}
                onChange={this.handleFile}
                className={`form-control ${this.props.className}`}
            />
        );
    }

}
CQQuestionUploader.propTypes = {
    onQuestionRawData: React.PropTypes.func,
    onQuestionData: React.PropTypes.func,
    onQuestionFile: React.PropTypes.func,
    id: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    format: React.PropTypes.string
};

CQQuestionUploader.defaultProps = {
    onQuestionRawData: function(){},
    onQuestionData: function(){},
    onQuestionFile: function(){},
    className: '',
    format: ''
};


export default CQQuestionUploader;
