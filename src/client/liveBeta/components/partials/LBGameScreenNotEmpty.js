import React, { PropTypes } from 'react';
import LBPlayers from './LBPlayers';

var unmanned = require('./../../assets/unnamed.png');

class LBGameScreenNotEmpty extends React.Component {
    render () {
        return (
            <div>
                <div className="lb-gamescreen__banner">
                    <img src={unmanned} height="494"/>
                </div>
                <LBPlayers {...this.props}/>
            </div>
        );
    }
}

export default LBGameScreenNotEmpty;
