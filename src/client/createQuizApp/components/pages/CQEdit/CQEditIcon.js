/* @flow */
import React from 'react';

import {
    CQQuizIcon,
    CQImageUploader
} from './../../../components';


import { MediaActions } from './../../../actions';
import type {QuizComplete} from './../../../../../types';

type Props = {
    quiz: QuizComplete;
    onIcon: Function;
};

type State = {
    quizImageFile?: Object;
    quizImageData?: string;
}
class CQEditIcon extends React.Component {

    props: Props;
    state: State;

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
        MediaActions.uploadPicture(quizImageFile, 'quiz').then((result)=>{
            this.refs.icon.resetLocalImage();
            this.props.onIcon(result);
        });
    }

    render () : any {
        return (
            <div className="cq-edit__icon__wrapper">
                <h6 className="cq-edit__icon__label">
                    Upload an Icon
                    <CQImageUploader
                        id="imageUploader"
                        className="cq-edit__icon__label__input"
                        onImageData={this.handleQuizImageData}
                        onImageFile={this.handleQuizImageFile}
                    />
                </h6>
                <label htmlFor="imageUploader">

                    <CQQuizIcon
                        ref="icon"
                        className="cq-edit__icon__component"
                        name={this.props.quiz.meta.name}
                        image={this.props.quiz.meta.imageUrl}
                        imageData={this.state.quizImageData}
                    />
                </label>
            </div>
        );
    }
}

CQEditIcon.propTypes = {
    quiz: React.PropTypes.object,
    onIcon: React.PropTypes.func
};

export default CQEditIcon;
