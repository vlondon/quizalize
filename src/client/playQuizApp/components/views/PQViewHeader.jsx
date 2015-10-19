/* @flow */
var React = require('react');

var PQViewHeader = React.createClass({

    render: function(): any {
        return (
            <nav className="navbar navbar-default navbar-fixed-top ng-scope">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a href="/">
                            <img src="/img/quizalize.png" style={{height: 44, marginTop: 9, paddingLeft: 5}} />
                            <button type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar" onclick="return false" className="navbar-toggle collapsed">
                                <span className="sr-only">Toggle navigation</span><span className="icon-bar" /><span className="icon-bar" /><span className="icon-bar" />

                            </button>

                        </a>

                    </div>
                    <div id="navbar" className="navbar-collapse collapse">
                        <ul className="nav navbar-nav navbar-right">
                            <li>
                                <a href="/quiz" style={{margin: 9, height: 10, lineHeight: '1.42857143', padding: '10px 10px 30px'}} className="pull-right btn btn-info">Create a quiz in 60 seconds!</a>

                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }

});

module.exports = PQViewHeader;
