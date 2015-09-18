var React = require('react');
var CQLink = require('createQuizApp/components/utils/CQLink');
var UserActions = require('createQuizApp/actions/UserActions');
var UserStore = require('createQuizApp/stores/UserStore');

var _timeout;
var CQHeaderDropdown = React.createClass({

    getInitialState: function() {
        return {
            open: false,
            user: UserStore.getUser()
        };
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState({
            user: UserStore.getUser()
        });
    },

    handleOver: function(){
        clearTimeout(_timeout);
        this.setState({open: true});
    },

    handleOut: function(){
        _timeout = setTimeout(()=>{
            this.setState({open: false});
        }, 200);
    },


    handleLogout: function () {
        UserActions.logout();
    },

    render: function() {
        var dropdown;

        if (this.state.open) {
            dropdown = (
                <div className="person-menu">
                    <ul>
                        <li><CQLink href='/quiz/settings'>Settings</CQLink></li>
                        <li><a target="_blank" href="https://s3-eu-west-1.amazonaws.com/quizalize/Quizalize+Teacher+Guide.pdf">Help</a></li>
                        <li><a onClick={this.handleLogout}>Logout</a></li>
                    </ul>
                </div>
            );
        }
        return (
            <li>
                <div className="navbar-dropdown" onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                    Hi {this.state.user && this.state.user.name}! <i className="fa fa-caret-down"></i>
                    {dropdown}
                </div>
            </li>
        );
    }

});

module.exports = CQHeaderDropdown;
