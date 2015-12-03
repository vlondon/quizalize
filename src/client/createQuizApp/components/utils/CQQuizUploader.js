/* @flow */
import React from 'react';

import { QuizStore } from './../../stores';

import { importFileParser } from './../../utils';

import type { Question } from './../../../../types';

import { QuizActions } from './../../actions';


class CQQuizUploader extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {};

        this.handleFile = this.handleFile.bind(this);
    }

    handleFile(ev:Object){
        if (ev.target.files[0].size <= 1048576){
            var reader = new FileReader();
            reader.onload = (upload) =>{
                var data = upload.target.result;
                this.setState({ data });
                this.props.onQuizRawData(data);
                this.processData(data);
            };

            var dataFile = ev.target.files[0];

            this.setState({ dataFile });
            this.props.onQuizFile(dataFile);
            reader.readAsText(dataFile);
        }
        else {
            window.swal("Oops...", "The file you are trying to upload it too large. The maximum size for your file is 1MB", "error");
        }
    }


    processData (data: string) {
        let processedData = {};
        if (this.props.format == "doodlemath") {
            processedData = importFileParser(data, this.props.format);
        }
        Object.keys(processedData).forEach( function(key) {
            let newQuiz = QuizStore.getQuiz();
            newQuiz.meta.name = key;
            newQuiz.payload.questions = processedData[key].questions;
            QuizActions.newQuiz(newQuiz);
        });
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
CQQuizUploader.propTypes = {
    onQuizRawData: React.PropTypes.func,
    onQuizData: React.PropTypes.func,
    onQuizFile: React.PropTypes.func,
    id: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    format: React.PropTypes.string,
    quizId: React.PropTypes.string
};

CQQuizUploader.defaultProps = {
    onQuizRawData: function(){},
    onQuizData: function(){},
    onQuizFile: function(){},
    className: '',
    format: ''
};


export default CQQuizUploader;
