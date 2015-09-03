/* @flow */
import React from 'react';

import CQQuizIcon from './../../../components/utils/CQQuizIcon';
import CQImageUploader from './../../../components/utils/CQImageUploader';

import type {QuizComplete} from './../../../stores/QuizStore';

type Props = {
    quiz: QuizComplete;
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
    }

    render () : any {
        return (
            <div className="cq-edit__icon__wrapper">
                <CQQuizIcon
                    className="cq-edit__icon__component"
                    name={this.props.quiz.meta.name}
                    image={this.props.quiz.meta.imageUrl}
                    imageData={this.state.quizImageData}
                />
                <CQImageUploader
                    onImageData={this.handleQuizImageData}
                    onImageFile={this.handleQuizImageFile}
                />
            </div>
        );
    }
}

CQEditIcon.propTypes = {
    quiz: React.PropTypes.object
};

export default CQEditIcon;
