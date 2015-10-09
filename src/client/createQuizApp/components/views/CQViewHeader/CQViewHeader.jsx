var React = require('react');
var router = require('createQuizApp/config/router');

var CQLink = require('createQuizApp/components/utils/CQLink');
var CQAnalytics = require('createQuizApp/components/utils/CQAnalytics');
var CQViewHeaderDropdown = require('./CQViewHeaderDropdown');
var MeStore = require('createQuizApp/stores/MeStore');


var sections = {
    apps: [
        'apps'
    ],
    quiz: [
        'quizzes',
        'create'
    ],
    user: [
        'user'
    ],
    classes: [
        'assignments'
    ],
    public: [
        'marketplace'
    ]
};

var CQViewHeader = React.createClass({

    propTypes: {
        minimal: React.PropTypes.bool
    },

    getInitialState: function() {
        return this.getState();
    },

    componentWillMount: function() {
        this.setState({path: router.getRoute()});

    },

    componentDidMount: function() {
        MeStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        MeStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var isLoggedIn = MeStore.isLoggedIn();
        var home = isLoggedIn ? "/quiz/user" : "/";

        return {
            isLoggedIn,
            home
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
                    <CQLink href="/quiz/user" className={isActive('user') ? 'navbar-btn active' : 'navbar-btn'}>
                        <i className="fa fa-th-large"></i> Your Profile
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

            loginButton = <CQViewHeaderDropdown/>;
        } else {
            loginButton = (
                <li>
                    <CQLink href="/quiz/login" className="navbar-btn">
                        Login
                    </CQLink>
                </li>);
        }

        if (this.props.minimal === true){
            return (
                <nav className="cq-header">
                    <div className="cq-header__container">
                        <div className="cq-header__brand">
                            <CQLink href="/quiz/assignments" className={isActive('public') ? 'navbar-btn active' : 'navbar-btn'}>
                                <div className="fa fa-chevron-left"></div> Back to Quizalize
                            </CQLink>
                            {/*
                                <a href={this.state.home}>
                                    <img src="/img/quizalize.png" className="cq-brand" alt=""/>
                                </a>
                            */}
                        </div>
                        <ul className="cq-header__buttons">


                        </ul>

                    </div>
                    <CQAnalytics/>
                </nav>
            );
        } else {

            return (
                <nav className="cq-header">
                    <div className="cq-header__container">
                        <div className="cq-header__brand">
                            <a href={this.state.home}>
                                <img src="/img/quizalize.png" className="cq-brand" alt=""/>
                            </a>
                        </div>
                        <ul className="cq-header__buttons">

                            {buttons}

                            <li id="cq-publicQuizzes">
                                <CQLink href="/quiz/marketplace" className={isActive('public') ? 'navbar-btn active' : 'navbar-btn'}>
                                    <div className="fa fa-tags"></div> Marketplace
                                </CQLink>
                            </li>

                            {loginButton}

                        </ul>

                    </div>
                    <CQAnalytics/>
                </nav>

            );

        }
    }

});

module.exports = CQViewHeader;
