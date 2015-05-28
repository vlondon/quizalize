var React = require('react');

var CQQuizOfTheDay = React.createClass({



    propTypes: {
        quiz: React.PropTypes.object,
        results: React.PropTypes.array,
        play: React.PropTypes.func,
        assign: React.PropTypes.func,
        leaderboard: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            quiz: {
                settings: {}
            },
            results: []
        };
    },

    handlePlay: function(){
        this.props.play();
    },
    handleAssign: function(){
        this.props.assign();
    },
    handleLeaderboard: function(){
        this.props.leaderboard();
    },

    render: function() {

        var background = {};

        if (this.props.quiz.settings.imageUrl) {
            background  = {
                backgroundImage: `url(${this.props.quiz.settings.imageUrl})`
            };
        }

        var takeoverButton;
        var playButton;
        var assignButton;
        var leaderboardButton;

        if (this.props.play) {
            takeoverButton = (<div className="qd-action-takeover" onClick={this.handlePlay}/>);
            playButton = (
                <button type="button" className="btn btn-play" onClick={this.handlePlay}>
                    Play
                </button>
            );
        }
        if (this.props.assign){
            assignButton = (
                <button type="button" className="btn" onClick={this.handleAssign}>
                    Set this quiz for your Class
                </button>
            );
        }

        if (this.props.leaderboard){
            leaderboardButton = (
                <button type="button" className="btn" onClick={this.handleLeaderboard}>
                    Global leaderboard
                </button>
            );
        }

        return (
            <div className="container quiz qd-container">
                <div className="qd-header">
                    Quiz of the day
                </div>

                <div className="qd-description" style={background}>

                    {takeoverButton}
                    <div className="qd-source">
                        source: {this.props.quiz.settings.imageAttribution}
                    </div>
                    <div className="qd-description-details">

                        <div className="qd-text">
                            <h3>{this.props.quiz.name}</h3>
                            <p>{this.props.quiz.settings.Description}</p>
                        </div>



                        <div className="qd-actions">


                            <div className="qd-actions-main">
                                {playButton}
                                {assignButton}
                                {leaderboardButton}
                            </div>


                            <div className="qd-actions-extra">
                                <button className="btn btn-social btn-twitter" type="button">
                                    <span className="fa fa-lg fa-twitter"/>
                                </button>

                                <button className="btn btn-social btn-facebook" type="button">
                                    <span className="fa fa-lg fa-facebook"/>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>


            </div>
    );
}

});

module.exports = CQQuizOfTheDay;
