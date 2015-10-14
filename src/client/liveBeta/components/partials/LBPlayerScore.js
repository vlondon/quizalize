import React, { PropTypes } from 'react';

class LBPlayerScore extends React.Component {
    render () {
        return (
            <div className="lb-playerscore">
                {this.props.score}
                
            </div>
        );
    }
}

LBPlayerScore.propTypes = {
    score: PropTypes.number.isRequired
};

export default LBPlayerScore;
