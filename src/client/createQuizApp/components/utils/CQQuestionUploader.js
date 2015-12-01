/* @flow */
import React from 'react';

import { importFileParser } from './../../utils';

import type { Question } from './../../../../types';

class CQQuestionUploader extends React.Component {

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
                this.props.onQuestionRawData(data);
                this.props.onQuestionData(importFileParser(data, this.props.format, this.props.quizId));
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
    format: React.PropTypes.string,
    quizId: React.PropTypes.string
};

CQQuestionUploader.defaultProps = {
    onQuestionRawData: function(){},
    onQuestionData: function(){},
    onQuestionFile: function(){},
    className: '',
    format: '',
    quizId: ''
};


export default CQQuestionUploader;
