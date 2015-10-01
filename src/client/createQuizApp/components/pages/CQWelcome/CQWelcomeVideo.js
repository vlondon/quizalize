/* @flow */
import React, {PropTypes} from 'react';

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
        return (
            <div className="cq-welcome__video" onClick={this.handleDismiss}>
                <div className="cq-welcome__video__iframe">
                    <div className="cq-welcome__video__icon"><i className="fa fa-times"></i></div>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/J3_CWmLcEI0?autoplay=1" frameBorder="0" allowFullScreen></iframe>
                </div>
            </div>
        );
    }

}
CQWelcomeVideo.propTypes = {
    onDismiss: PropTypes.func
};

export default CQWelcomeVideo;
