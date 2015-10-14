import React, { PropTypes } from 'react';
import LBFooterPlayer from './LBFooterPlayer';

let strengthsWeaknesses = require('./../../assets/strenghts-weaknesses.png');
let arrowUp = require('./../../assets/icon_arrow-up.png');
class LBFooter extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        this.props.handleSAW();
    }

    render () {
        let footer;
        if (this.props.ClassData.output.hasData) {
            let students = this.props.ClassData.output.leaderboards.totals;
            var green, amber, red, players;
            if (this.props.ClassData.output.leaderboards.green) {
                green = this.props.ClassData.output.leaderboards.green.users.map(student => {
                    return (<LBFooterPlayer key={student.user.uuid} student={student} level="green"/>);
                });
            }
            if (this.props.ClassData.output.leaderboards.amber) {
                amber = this.props.ClassData.output.leaderboards.amber.users.map(student => {
                    return (<LBFooterPlayer key={student.user.uuid} student={student} level="amber"/>);
                });
            }
            if (this.props.ClassData.output.leaderboards.red) {
                red = this.props.ClassData.output.leaderboards.red.users.map(student => {
                    return (<LBFooterPlayer key={student.user.uuid} student={student} level="red"/>);
                });
            }
            if (this.props.ClassData.output.leaderboards.unknown) {
                red = this.props.ClassData.output.leaderboards.unknown.users.map(student => {
                    return (<LBFooterPlayer key={student.user.uuid} student={student} level="grey"/>);
                });
            }
            if (this.props.ClassData.output.leaderboards.red) {
                if (this.props.ClassData.output.leaderboards.red.users.length == 1) {
                    players = `1 needs help`;
                }
                else {
                    players = `${this.props.ClassData.output.leaderboards.red.users.length} need help`;
                }

            }
            else {
                if (students.users.length === 1) {
                    players = `1 player`;
                }
                else if (students.users.length > 1){
                    players = `${students.users.length} players`;
                }
            }
            footer = (
                <div className="lb-footer__players" onClick={this.handleClick}>
                    {green}
                    {amber}
                    {red}
                    <span className="lb-footer__players__status">
                        {players} <img src={arrowUp} width="50" height="50" className="lb-footer__players__arrow"/>
                    </span>

                </div>
            );
        } else {
            footer = (
                <div className="lb-footer__nodata">
                    <img src={strengthsWeaknesses} alt="" className="lb-footer__nodata__image"/>
                    <h3 className="lb-footer__nodata__text">
                        Who needs your help <br/>
                        What do they need help with
                    </h3>
                </div>

            );
        }

        return (
            <div className="lb-footer">
                {footer}
            </div>
        );
    }
}

LBFooter.propTypes = {
    ClassData: PropTypes.object,
    handleSAW: PropTypes.func
};

LBFooter.defaultProps = {
    ClassData: {
        output: {
            hasData: false
        }
    }
};

export default LBFooter;
