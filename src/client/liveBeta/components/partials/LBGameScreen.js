import React, { PropTypes } from 'react';
import LBGameScreenEmpty from './LBGameScreenEmpty';
import LBGameScreenNotEmpty from './LBGameScreenNotEmpty';


class LBGameScreen extends React.Component {
    render () {
        let showEmpty = this.props.dashState.students.length === 0 ? <LBGameScreenEmpty {...this.props}/> : <LBGameScreenNotEmpty {...this.props}/>;
        return (
            <div className="lb-gamescreen">
                {showEmpty}

            </div>
        );
    }
}
LBGameScreen.propTypes = {
    dashState: PropTypes.object
};

export default LBGameScreen;
