var React = require('react');
var router = require('createQuizApp/config/router');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQAnalytics = require('createQuizApp/components/utils/CQAnalytics');
var CQViewHeaderDropdown = require('./CQViewHeaderDropdown');

var UserStore = require('createQuizApp/stores/UserStore');
var UserActions = require('createQuizApp/actions/UserActions');


var sections = {
    apps: [
        'apps'
    ],
    quiz: [
        'quizzes',
        'create'
    ],
    classes: [
        'assignments'
    ],
    public: [
        'public'
    ]
};

var CQViewHeader = React.createClass({


    getInitialState: function() {
        return this.getState();
    },

    componentWillMount: function() {
        this.setState({path: router.getRoute()});

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


    render: function() {

        var buttons = [];
        var loginButton;

        var isActive = key =>{
            return sections[key] && sections[key].indexOf(this.state.path[1]) > -1;
        };

        if (this.state.isLoggedIn){
            buttons.push((
                <li id="cq-quizzes" key='cq-quizzes'>
                    <CQLink href="/quiz/quizzes" className={isActive('quiz') ? 'navbar-btn active' : 'navbar-btn'}>
                        <i className="fa fa-th-large"></i> Your quizzes
                    </CQLink>
                </li>));

                buttons.push((
                    <li id="cq-apps" key='cq-apps'>
                        <CQLink href="/quiz/apps" className={isActive('apps') ? 'navbar-btn active' : 'navbar-btn'}>
                            <i className="fa fa-archive"></i> Your apps
                        </CQLink>
                    </li>));

            buttons.push((
                <li id="cq-assignments" key='cq-assignments'>
                    <CQLink href="/quiz/assignments"
                        className={isActive('classes') ? 'navbar-btn active' : 'navbar-btn'}>
                        <i className="fa fa-users"></i> Your classes

                    </CQLink>
                </li>
            ));

            loginButton = (
                <CQViewHeaderDropdown/>);
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
                        <CQLink href="/quiz/quizzes">
                            <img src="/img/quizalize.png" className="cq-brand" alt=""/>
                            {this.state.user}
                        </CQLink>
                    </div>
                    <div className="navbar-collapse collapse" id="navbar">
                        <ul className="nav navbar-nav navbar-right">

                            {buttons}

                            <li id="cq-publicQuizzes">
                                <CQLink href="/quiz/public" className={isActive('public') ? 'navbar-btn active' : 'navbar-btn'}>
                                    <div className="fa fa-tags"></div> Marketplace
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

module.exports = CQViewHeader;
