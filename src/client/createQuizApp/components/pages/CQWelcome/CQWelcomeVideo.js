/* @flow */
import React, {PropTypes} from 'react';
import settings from './../../../config/settings';
type Props = {
    onDismiss: Function;
};

class CQWelcomeVideo extends React.Component {

    props: Props;
    constructor(props: Props){
        super(props);
        this.handleDismiss = this.handleDismiss.bind(this);
    }

    handleDismiss(){
        this.props.onDismiss();
    }

    render () : any {
        let videoURL = `${settings.CDNURL}quizalize/quizalize-intro-video_2.mp4`;
        return (
            <div className="cq-welcome__video" onClick={this.handleDismiss}>
                <div className="cq-welcome__video__iframe">
                    <div className="cq-welcome__video__icon"><i className="fa fa-times"></i></div>
                    <video id="cq-welcome__video__player" width="800" height="450" controls="controls" autoPlay="autoPlay" preload="auto">
                        <source src={videoURL} type='video/mp4'/>
                    </video>
                </div>
            </div>
        );
    }

}
CQWelcomeVideo.propTypes = {
    onDismiss: PropTypes.func
};

export default CQWelcomeVideo;
