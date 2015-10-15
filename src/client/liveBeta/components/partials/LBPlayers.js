import React, { PropTypes } from 'react';
import LBScore from './LBScore';
import LBPlayer from './LBPlayer';

class LBPlayers extends React.Component {

    constructor(props){
        super(props);
        this.getState.bind(this);
        this.state = this.getState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(this.getState(nextProps));
    }

    getState(props){
        var teamA = [];
        var teamB = [];
        if (props.dashState) {
            props.dashState.students.forEach((student, index)=>{

                var split = index % 2;
                if (split === 0) {
                    teamA.push(student);
                } else {
                    teamB.push(student);
                }
            });
        }
        var scoreTeamA = teamA.reduce((a, b)=> { return {score: a.score + b.score} ; }, {score: 0}).score;
        var scoreTeamB = teamB.reduce((a, b)=> { return {score: a.score + b.score} ; }, {score: 0}).score;
        var teamAWinner = scoreTeamA >= scoreTeamB;
        var teamBWinner = scoreTeamB >= scoreTeamA;

        return  {
            teamA, teamB, teamAWinner, teamBWinner
        };
    }

    render () {
        let {teamA, teamB, teamAWinner, teamBWinner} = this.state;
        return (
            <div className="lb-teams">
                <div className="lb-teams__a">
                    <LBScore team={teamA} winner={teamAWinner} />
                    {this.state.teamA.map(student=>{
                        return (<LBPlayer player={student}
                            key={student.uuid}
                            direction='right'
                            className="lb-teams__a__student"
                        />);
                    })}
                </div>
                <div className="lb-teams__b">
                    <LBScore team={teamB} winner={teamBWinner}/>
                    {this.state.teamB.map(student=>{
                        return (
                            <LBPlayer player={student}
                                key={student.uuid}
                                direction='left'
                                className="lb-teams__b__student"
                            />
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default LBPlayers;
