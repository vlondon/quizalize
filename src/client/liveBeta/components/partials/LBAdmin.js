import React, { PropTypes } from 'react';
import studentsHelper from './../../helpers/students';

const minInterval = 300;
const maxInterval = 1000;
let randomStep = 0;
class LBAdmin extends React.Component {

    constructor(props){
        super(props);
        this.updateLBState = this.updateLBState.bind(this);
        this.handleAddPlayer = this.handleAddPlayer.bind(this);
        this.handleAddPoints = this.handleAddPoints.bind(this);
        this.doSomethingRandom = this.doSomethingRandom.bind(this);


        // let timer = Math.random() * maxInterval + minInterval;
        // setTimeout(this.doSomethingRandom, timer);
    }
    componentDidMount() {
        this.doSomethingRandom();
    }
    doSomethingRandom(){
        var {dashState} = this.props;
        // 1 new student, 2 score

        let action = 1;
        if (dashState.students.length > 5) {
            action = Math.random() > 0.5 ? 1 : 2;
        }
        if (dashState.students.length >= 10) {
            action = 2;
        }

        if (action === 1){
            this.handleAddPlayer();
        } else if (action === 2){
            this.handleAddPoints();
        }
        console.log('doing something radonm', action);
        let timer = Math.random() * maxInterval + minInterval;
        randomStep++;
        if (randomStep < 30){
            setTimeout(this.doSomethingRandom, timer);
        }

    }

    updateLBState(){
        var {dashState} = this.props;
        this.props.onStateUpdate(dashState);
    }
    handleAddPlayer(){
        var {dashState} = this.props;
        var newStudent = studentsHelper.newStudent();
        dashState.students.push(newStudent);
        this.props.onStateUpdate(dashState);
    }

    handleAddPoints(){
        var {dashState} = Object.assign({}, this.props);
        var randomPlayerIndex = Math.round(Math.random() * (dashState.students.length - 1));
        var randomPlayer = Object.assign({}, dashState.students[randomPlayerIndex]);
        randomPlayer.score += Math.round(Math.random()*200);
        randomPlayer.progress = (parseFloat(randomPlayer.progress) + parseFloat(0.1)).toFixed(1);
        if (randomPlayer.progress > 1 ) randomPlayer.progress = 1;
        dashState.students[randomPlayerIndex] = randomPlayer;

        this.props.onStateUpdate(dashState);
    }
    render () {
        return (<div/>);
        // return (
        //     <div className="lb-admin">
        //         <div>
        //             Control
        //         </div>
        //         <div>
        //             <a onClick={this.handleAddPlayer}>Add player</a>
        //         </div>
        //         <div>
        //             <a onClick={this.handleAddPoints}>Give points to random player</a>
        //         </div>
        //     </div>
        // );
    }
}
LBAdmin.propTypes = {
    dashState: PropTypes.object,
    onStateUpdate: PropTypes.func
};

export default LBAdmin;
