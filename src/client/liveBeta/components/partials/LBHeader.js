import React, { PropTypes } from 'react';
import instructionsBanner from './../../assets/instructions-banner.png';

class LBHeader extends React.Component {
    render () {
        return (
            <div className="lb-header">
                <div className="lb-header__information">
                    <img src={instructionsBanner} width="600" className="lb-header__picture"/>
                    <div className="lb-header__code">
                        {this.props.dashState ? this.props.dashState.classCode : ""}
                    </div>
                </div>
            </div>
        );
    }
}

LBHeader.propTypes = {
    dashState: PropTypes.object
};

export default LBHeader;
