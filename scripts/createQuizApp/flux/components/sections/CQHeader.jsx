var React = require('react');

var CQLink = require('createQuizApp/flux/components/utils/CQLink');
var UserStore = require('createQuizApp/flux/stores/UserStore');
var UserActions = require('createQuizApp/flux/actions/UserActions');

require('./CQHeaderStyles');

var CQHeader = React.createClass({

    getInitialState: function() {
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
        var isLoggedIn = UserStore.getUser() !== false;
        return {
            isLoggedIn
        };
    },

    handleLogout: function () {
        UserActions.logout();
    },


    render: function() {

        var buttons = [];
        var loginButton;

        if (this.state.isLoggedIn){
            buttons.push((
                <li id="cq-quizzes" key='cq-quizzes'>
                    <CQLink href="/quiz/quizzes" className="btn btn-info navbar-btn">
                        Your quizzes
                    </CQLink>
                </li>));

                buttons.push((
                <li id="cq-assignments" key='cq-assignments'>
                    <CQLink href="/quiz/assignments" className="btn btn-info navbar-btn">
                        Your assignments
                    </CQLink>
                </li>
            ));

            loginButton = (
                <li>
                    <button onClick={this.handleLogout} type="button" className="btn btn-info navbar-btn">
                        Log out
                    </button>
                </li>);
        } else {
            loginButton = (
                <li>
                    <CQLink href="/quiz/login/" className="btn btn-info navbar-btn">
                        Login
                    </CQLink>
                </li>);
        }






        return (
            <nav className="navbar navbar-default cq-header">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a href="/quiz/">
                            <img src="/img/quizalize.png" className="cq-brand" alt=""/>
                            {this.state.user}
                        </a>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav navbar-right">

                            {buttons}

                            <li id="cq-publicQuizzes">
                                <CQLink href="/quiz/public" className="btn btn-info navbar-btn">
                                    Public quizzes
                                </CQLink>
                            </li>

                            <li id="cq-publicQuizzes">
                                <CQLink href=""className="btn btn-info navbar-btn">
                                    ?
                                </CQLink>
                            </li>

                            {loginButton}


                        </ul>
                    </div>
                </div>
            </nav>

        );
    }

});

module.exports = CQHeader;
