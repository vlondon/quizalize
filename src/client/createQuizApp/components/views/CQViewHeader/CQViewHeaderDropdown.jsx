var React = require('react');
var CQLink = require('createQuizApp/components/utils/CQLink');
var UserActions = require('createQuizApp/actions/UserActions');
var MeStore = require('createQuizApp/stores/MeStore');

var _timeout;
var CQHeaderDropdown = React.createClass({

    getInitialState: function() {
        return {
            open: false,
            user: MeStore.state
        };
    },

    componentDidMount: function() {
        MeStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        MeStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.forceUpdate();
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
                        <li><a target="_blank" href="/quiz/welcome">Help</a></li>
                        <li><a onClick={this.handleLogout}>Logout</a></li>
                    </ul>
                </div>
            );
        }
        return (
            <li>
                <div className="navbar-btn" onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                    Hi {MeStore.state.name}! <i className="fa fa-caret-down"></i>
                    {dropdown}
                </div>
            </li>
        );
    }

});

module.exports = CQHeaderDropdown;
