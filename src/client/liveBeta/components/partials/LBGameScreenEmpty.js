import React, { PropTypes } from 'react';

class LBGameScreenEmpty extends React.Component {

    handlePlay(ev){
        swal({  title: "Play Later",   text: "You can always load this dashboard by going to 'Your Classes' (at the top) and clicking on the 'View Info' button",     confirmButtonText: "Got it!" });
    }

    handleHelp(ev){
        swal({   title: "Help",   text: "Ask your students to go to http://quiz.al and enter their name and class code",    confirmButtonText: "Got it!" , html: true});
    }

    render () {
        return (
            <div className="lb-gamesscreenempty">
                <div className="lb-gamesscreenempty__title">
                    {this.props.dashState ? this.props.dashState.activityName: ""}
                </div>
                <div className="lb-gamesscreenempty__waiting">
                    Waiting for players
                </div>
                <div className="lb-gamesscreenempty__button">
                    <span onClick={this.handlePlay}>Play later</span>
                </div>

                <div className="lb-gamesscreenempty__button">
                    <span onClick={this.handleHelp}>Help</span>
                </div>
            </div>
        );
    }
}


LBGameScreenEmpty.propTypes = {
    dashState: PropTypes.object
};

export default LBGameScreenEmpty;
