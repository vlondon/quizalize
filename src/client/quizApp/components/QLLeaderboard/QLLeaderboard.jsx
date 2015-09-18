
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

        var leaderboard = [];
        leaderboard = props.leaderboard.slice(0, props.limit);

        if (props.activityId) {

            var getSelectedPosition = function(){
                var ownScoreItem = leaderboard.filter(s => s.uuid === props.activityId)[0];
                console.log('ownScore', ownScoreItem);
                return leaderboard.indexOf(ownScoreItem);
            };


            var ownScore = props.leaderboard.filter(s => s.uuid === props.activityId)[0];
            var p = getSelectedPosition();
            if (p !== -1) {
                leaderboard[p].selected = true;
            } else if (ownScore) {
                console.log('ownScore', ownScore, props);
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
                        Top scores
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
