/* @flow */
import React, { PropTypes } from 'react';

import { CQImageUploader } from './../../../components';
import { MediaActions } from './../../../actions';
import type { Quiz } from './../../../../../types';
type Props = {
    quiz: Quiz;
    onIcon: Function;
};
class CQSettingsProfilePictureUpload extends React.Component {

    props: Props;
    constructor(props : Props) {
        super(props);
        this.state = {};

        this.handleQuizImageFile = this.handleQuizImageFile.bind(this);
        this.handleQuizImageData = this.handleQuizImageData.bind(this);

    }


    handleQuizImageData(quizImageData : string){
        this.setState({ quizImageData });
    }

    handleQuizImageFile(quizImageFile : Object){
        this.setState({ quizImageFile });
        MediaActions.uploadPicture(this.props.quiz.uuid, quizImageFile).then((result)=>{
            this.refs.icon.resetLocalImage();
            this.props.onIcon(result);
        });
    }


    render () : any {
        return (
            <div>
                <CQImageUploader
                    id="imageUploader"
                    className="cq-edit__icon__label__input"
                    onImageData={this.handleQuizImageData}
                    onImageFile={this.handleQuizImageFile}
                />
            </div>
        )
    }
}
CQSettingsProfilePictureUpload.propTypes = {
    quiz: PropTypes.object,
    onIcon: PropTypes.function
}
export default CQSettingsProfilePictureUpload;
