import React, { PropTypes } from 'react';

import LBAdmin from './../components/partials/LBAdmin';
import LBHeader from './../components/partials/LBHeader';
import LBGameScreen from './../components/partials/LBGameScreen';
import LBFooter from './../components/partials/LBFooter';
import debounce from 'lodash/function/debounce';
require('./../styles/liveBeta.scss');

let lastKeys = '';
class LiveBeta extends React.Component {

    constructor(props){
        super(props);
        this.handleStateUpdate = this.handleStateUpdate.bind(this);
        this.handleResize = debounce(this.handleResize.bind(this), 400);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = {
            showAdmin: true
        };

    }

    handleResize(){
        this.forceUpdate();
    }

    handleKeyDown(ev){
        lastKeys += String.fromCharCode(ev.which);

        if (lastKeys.endsWith('ILOVEZZISH')){
            this.setState({showAdmin: true});
        }
        // keyPresses.
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleStateUpdate(newState){
        this.props.onStateUpdate(newState);
    }
    render () {
        let admin = this.state.showAdmin ? <LBAdmin {...this.props} onStateUpdate={this.handleStateUpdate}/> : null;
        return (
            <div className="lb-all">
                {admin}
                <LBGameScreen {...this.props}/>
            </div>
        );
    }
}

LiveBeta.propTypes = {
    onStateUpdate: PropTypes.func.isRequired
};

export default LiveBeta;
