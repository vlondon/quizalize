
var React = require('react');

var QLLeaderboard = React.createClass({

    getDefaultProps: function() {
        return {
            leaderboard: [],
            limit: 5
        };
    },

    propTypes: {
        leaderboard: React.PropTypes.array,
        limit: React.PropTypes.number,
        activityId: React.PropTypes.string
    },

    getState: function(props){

        props = props || this.props;

        var getSelectedPosition = function(leaderboard, activityId){
            var ownScore = leaderboard.filter(s => s.score === 200)[0];
            console.log('ownScore', ownScore);
            return leaderboard.indexOf(ownScore);
        };

        var leaderboard = [];
        leaderboard = props.leaderboard.slice(0, props.limit);

        var p = getSelectedPosition(leaderboard, 'asdf');
        if (p !== -1) {
            leaderboard[p].selected = true;
        } else {
            var ownScore = props.leaderboard.filter(s => s.score === 200)[0];
            leaderboard.push({
                score: '  ',
                name: '…'
            });
            leaderboard.push({
                score: ownScore.score,
                name: ownScore.name,
                selected: true
            });
            leaderboard.push({
                score: '  ',
                name: '…'
            });

            console.log('leaderboard', ownScore);
        }
        return { leaderboard };
    },

    getInitialState: function() {
        return this.getState();
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getState(nextProps));
    },

    render: function() {
        return (
            <div className='ql-leaderboard'>
                <div className="header">
                    <h3>
                        Top 5 scores
                    </h3>
                </div>
                {this.state.leaderboard.map( (entry, index) => {
                    return (
                        <div className={entry.selected ? 'entry entry-selected' : 'entry'} key={index}>
                            <div className="score">
                                {entry.score}
                            </div>
                            <div className="name">
                                {entry.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

});

module.exports = QLLeaderboard;
