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
            <div className="cq-welcome__quiz" onClick={this.handleDismiss}>
                <div className="cq-welcome__quiz__iframe">
                    <div className="cq-welcome__quiz__icon">
                        <i className="fa fa-times"></i>
                    </div>
                    <iframe width="100%" height="100%" src="/app#/play/public/b6c88f0b-17c7-434d-a709-588ace552797" frameBorder="0" allowFullScreen></iframe>
                </div>
            </div>
        );
    }

}
CQWelcomeVideo.propTypes = {
    onDismiss: PropTypes.func
};

export default CQWelcomeVideo;
