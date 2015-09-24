import React from 'react';

import CQImageUploader from './../../../components/utils/CQImageUploader';
import MediaActions from './../../../actions/MediaActions';

class CQSettingsProfilePictureUpload extends React.Component {

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


    render () {
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

export default CQSettingsProfilePictureUpload;
