var React = require('react');

var UserStore = require('createQuizApp/flux/stores/UserStore');

var CQHeader = React.createClass({

    getInitialState: function() {
        console.log('UserStore.getUser', UserStore.getUser());
        return this.getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var isLoggedIn = UserStore.getUser() !== undefined;
        return {
            isLoggedIn
        };
    },


    render: function() {

        var buttons = () => {
            var displayedButtons = [];
            if (this.state.isLoggedIn){
                displayedButtons.push((
                    <li id="cq-quizzes">
                        <a href="/quiz/#/quizzes" className="btn btn-info navbar-btn">
                            Your quizzes
                        </a>
                    </li>));

                displayedButtons.push((
                    <li id="cq-assignments">
                        <a href="/quiz/#/assignments" className="btn btn-info navbar-btn">
                            Your assignments
                        </a>
                    </li>
                ));
            }

            return displayedButtons;
        };

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a href="/quiz/">
                            <img src="/img/quizalize.png" className="cq-brand" alt=""/>
                            {this.state.user}
                        </a>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav navbar-right">

                            {buttons()}

                            <li id="cq-publicQuizzes">
                                <a href="/quiz/#/assignments" className="btn btn-info navbar-btn">
                                    Public quizzes
                                </a>
                            </li>

                            <li id="cq-publicQuizzes">
                                <a className="btn btn-info navbar-btn">
                                    ?
                                </a>
                            </li>

                            <li>
                                <a href="/quiz/#/login/" className="btn btn-info navbar-btn">
                                    Login
                                </a>
                            </li>


                        </ul>
                    </div>
                </div>
            </nav>

        );
    }

});

module.exports = CQHeader;
