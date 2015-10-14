import React, { PropTypes } from 'react';
var studentGrey = require('./../../assets/student-grey.png');
var studentOrange = require('./../../assets/student-orange.png');
var studentRed = require('./../../assets/student-questionmark.png');
var studentWhite= require('./../../assets/student-white.png');

var students = {
    grey: studentGrey,
    amber: studentOrange,
    red: studentRed,
    green: studentWhite
};

class LBFooterPlayer extends React.Component {
    render () {
        let choosenStudent = students[this.props.level];
        return (
            <div className="lb-footer__player">
                <img src={choosenStudent}/>
            </div>
        );
    }
}

LBFooterPlayer.propTypes = {
    key: PropTypes.string,
    student: PropTypes.object.isRequired,
    level: PropTypes.string
};

LBFooterPlayer.defaultProps = {
    level: "grey"
};


export default LBFooterPlayer;
