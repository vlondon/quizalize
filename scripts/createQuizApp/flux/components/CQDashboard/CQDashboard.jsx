var React = require('react');

var UserStore = require('createQuizApp/flux/stores/UserStore');
var UserActions = require('createQuizApp/flux/actions/UserActions');

require('./CQDashboardStyles');

var CQDashboard = React.createClass({

    getInitialState: function() {
        return {
            user: ''
        };
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        console.log('onChange');
        this.setState({user: UserStore.getUser()});
    },

    render: function() {
        return (
            <div className="container">
                <h2>
                    Hi there! What would you like to do?
                </h2>
                <br/>
                <div className="row">
                    <div className="row well">
                        <div className="quiz-preview">
                            <div className="row">
                                <div className="col-sm-6">

                                    <div className="border-block">
                                        <center>

                                            <h3>
                                                Make a classroom quiz in 60 seconds
                                            </h3>
                                        </center>
                                        <br/>
                                        <center>
                                            <a href="/register/create" className="btn btn-primary btn-lg">
                                                Create a new quiz
                                            </a>
                                        </center>

                                    </div>
                                </div>
                                <div className="col-sm-6">

                                    <div className="border-block">

                                        <center>

                                            <h3>
                                                Choose a pre-made quiz for your class
                                            </h3>
                                        </center>
                                        <br/>
                                        <center>
                                            <a href="" className="btn btn-primary btn-lg btn-info">Choose a quiz</a>
                                        </center>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

});

module.exports = CQDashboard;
