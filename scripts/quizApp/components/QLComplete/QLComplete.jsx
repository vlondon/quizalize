var React = require('react');


var QLAnswerScreen = React.createClass({

    propTypes: {
        totals: React.PropTypes.object
    },

    getDefaultProps: function() {
        return {
            totals: {}
        };
    },

    handleClick: function(){

    },

    render: function() {
        return (
            <div className="ql-complete container">
                <div className="ql-header">
                    <h3>Congratulations</h3>
                </div>

                <div className="ql-resume well">
                    <div className="ql-complete-info">
                        <div className="score-value rag2">
                            {this.props.totals.score}
                            <div className="score-points">Points</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = QLAnswerScreen;
