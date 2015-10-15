import React, { PropTypes } from 'react';
import {Motion, spring, presets} from 'react-motion';
import LBPlayerScore from './LBPlayerScore';


class LBPlayer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            position: this.getPosition(props),
            scores: []
        };
    }

    componentWillReceiveProps(nextProps) {
        var {scores} = this.state;

        var position = this.getPosition(nextProps);
        var scoreDiff =  nextProps.player.score - this.props.player.score;
        if (scoreDiff > 0){
            scores.push(scoreDiff);
        }

        this.setState({position, scores});
    }

    getPosition(props){
        var availableWidth = (window.innerWidth / 2) - 180;
        var direction = props.direction === 'right' ? 1 : -1;
        var position = availableWidth * props.player.progress * direction;
        return position;
    }

    render () {
        const {player, className} = this.props;
        var direction = this.props.direction === 'right' ? 1 : -1;
        var initialPosition  = 200 * direction;
        return (
            <Motion defaultStyle={{x: - initialPosition}} style={{x: spring(this.state.position, presets.wobbly )}}>
                {interpolatedStyle=>{
                    let style = {transform: `translateX(${interpolatedStyle.x}px)`};
                    return (
                        <div className={className} style={style}>
                            {player.name}
                            {this.state.scores.map((score, index) =>{
                                return (<LBPlayerScore score={score} key={index}/>);
                            }) }
                        </div>
                    );
                }}
            </Motion>
        );
    }
}

LBPlayer.propTypes = {
    player: PropTypes.object,
    className: PropTypes.string,
    direction: PropTypes.string
};

export default LBPlayer;
