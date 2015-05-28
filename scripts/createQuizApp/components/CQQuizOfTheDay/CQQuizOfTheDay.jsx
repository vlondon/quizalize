var React = require('react');

var CQQuizOfTheDay = React.createClass({



    propTypes: {
        quiz: React.PropTypes.object,
        results: React.PropTypes.array
    },

    getDefaultProps: function() {
        return {
            quiz: {
                settings: {}
            },
            results: []
        };
    },

    render: function() {

        return (
            <div className="container quiz cq-quizoftheday">
                <div className="header">
                    Quiz of the day
                </div>

                <div className="description">
                    <img src={this.props.quiz.settings.imageUrl} alt=""/>
                    <h3>{this.props.quiz.name}</h3>
                    <p>{this.props.quiz.settings.Description}</p>
                </div>

                <div className="leaderboard">
                    <p>
                        Top 5 Scores
                    </p>
                    <ul>
                        <li></li>
                    </ul>
                </div>

                <div className="row">
                    <div className="col-md-3 quiz-col quiz-col1">
                        <div className="row"><img src={this.props.quiz.settings.imageUrl} className="quiz-img img-responsive"/></div>
                        <div className="row"><a tabindex="0" className="glyphicon glyphicon-question-sign att-icon"></a><span className="attribution">ctrl.quiz.settings.imageAttribution</span></div>
                        <div id="social media" className="row social">
                            <p>Share this quiz</p>
                            <ul>
                                <li>	<a target="_blank" href="http://www.facebook.com/sharer/sharer.php?u=quizalize.com/#quiz/quiz-of-the-day"> <span className="fa fa-lg fa-facebook"> </span></a></li>
                                <li> <a target="_blank" ng-href="http://twitter.com/home?status=I'm%20playing%20 - ctrl.quiz.name - , the Quizalize quiz%20of%20the%20day%20%40quizalizeapp.%20http://bit.ly/quizaday%0A"> <span className="fa fa-lg fa-twitter"> </span></a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-5 quiz-col col-x6-6">
                        <div className="row text-center quiz-title">
                            <h3 className="quiz1">Quiz of the day - ctrl.quiz.name -  </h3>
                        </div>
                        <div className="row date">
                            <h4> - ctrl.quiz.settings.featureDate - </h4>
                        </div>
                        <div className="row description">
                            <p> - ctrl.quiz.settings.Description - </p>
                        </div>
                        <div className="row leaderboard"></div>
                        <h4 className="quiz1">Top 5 Scores </h4><span ng-show="ctrl.loading">Loading ...</span>
                        <div ng-show="!ctrl.loading" ng-repeat="player in ctrl.results | orderObjectBy:['-score'] | limitTo:ctrl.quantityToShow track by $index" className="row">
                            <div className="col-xs-1"><span className="quiz1"> - $index+1 - .</span></div>
                            <div data-toggle="tooltip" title=" - player.profile.name - " data-placement="top" className="col-xs-7"><span className="quiz1 over"> - player.profile.name - </span>
                            <script>$('[data-toggle="tooltip"]').tooltip();                   </script>
                        </div>
                        <div className="col-xs-4">			<span ng-switch="player.statusInt" ng-show="player.score" className="quiz1"> - player.score -  </span></div>
                    </div>
                </div>
                <div className="col-md-4 quiz-col quiz-col2 col-xs-3">
                    <div id="play row" className="row play">
                        <button ng-click="ctrl.playQuiz(ctrl.quiz)" id="play-button" className="button">Play</button>
                    </div>
                    <div className="row playtoo">
                        <button ng-click="ctrl.assignQuiz(ctrl.quiz)" id="play-too" className="button">Set this quiz for your Class</button>
                    </div>
                    <div className="row global-lead"><a ng-href="/quiz#/results/ - ctrl.quiz.uuid - " className="button">Global Leaderboard</a></div>
                </div>
            </div>
        </div>
    );
}

});

module.exports = CQQuizOfTheDay;
