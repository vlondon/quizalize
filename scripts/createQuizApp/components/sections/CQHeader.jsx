var React = require('react');
var router = require('createQuizApp/config/router');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQAnalytics = require('createQuizApp/components/utils/CQAnalytics');
var CQHeaderDropdown = require('./CQHeaderDropdown');

var UserStore = require('createQuizApp/stores/UserStore');
var UserActions = require('createQuizApp/actions/UserActions');

require('./CQHeaderStyles');

var CQHeader = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        console.log('get Current Path', router.getPath());
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
                    <CQLink href="/quiz/quizzes" className="navbar-btn">
                        <i className="fa fa-th-large"></i> Your quizzes
                    </CQLink>
                </li>));

                buttons.push((
                <li id="cq-assignments" key='cq-assignments'>
                    <CQLink href="/quiz/assignments" className="navbar-btn">
                        <i className="fa fa-users"></i> Your classes

                    </CQLink>
                </li>
            ));

            loginButton = (
                <CQHeaderDropdown/>);
        } else {
            loginButton = (
                <li>
                    <CQLink href="/quiz/login" className="navbar-btn">
                        Login
                    </CQLink>
                </li>);
        }


        return (
            <nav className="cq-header">
                <div className="cq-header__container">
                    <div className="cq-header__brand">
                        <a href="/quiz/">
                            <img src="/img/quizalize.png" className="cq-brand" alt=""/>
                            {this.state.user}
                        </a>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav navbar-right">

                            {buttons}

                            <li id="cq-publicQuizzes">
                                <CQLink href="/quiz/public" className="navbar-btn">
                                    <div className="fa fa-tags"></div> Public quizzes
                                </CQLink>
                            </li>

                            {loginButton}

                        </ul>
                    </div>
                </div>
                <CQAnalytics/>
            </nav>

        );
    }

});

module.exports = CQHeader;
