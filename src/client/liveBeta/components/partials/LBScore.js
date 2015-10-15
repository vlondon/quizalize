import React, { PropTypes } from 'react';
import {Motion, spring} from 'react-motion';

class LBScore extends React.Component {
    constructor(props){
        super(props);
        var score = props.team.reduce((a, b)=> { return {score: a.score + b.score} ; }, {score: 0}).score;
        this.state = {
            score
        };
    }
    componentWillReceiveProps(props){
        var score = props.team.reduce((a, b)=> { return {score: a.score + b.score} ; }, {score: 0}).score;
        this.setState({score});
    }
    render () {
        let positionLabel = this.props.winner === true ? '1st' : '2nd';
        return (
            <Motion defaultStyle={{score: 0}} style={{score: spring(this.state.score)}}>
                {interpolatedStyle =>
                    <div className="lb-score">
                        <div>
                            <small className="lb-score__position">{positionLabel}</small>
                            <div>{Math.round(interpolatedStyle.score)}</div>
                        </div>
                    </div>
                }
            </Motion>
        );
    }
}
LBScore.propTypes = {
    team: PropTypes.array,
    winner: PropTypes.bool
};


export default LBScore;
