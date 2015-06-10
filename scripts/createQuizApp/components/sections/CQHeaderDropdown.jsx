var React = require('react');
var CQLink = require('createQuizApp/components/utils/CQLink');

var _timeout;
var CQHeaderDropdown = React.createClass({

    getInitialState: function() {
        return {
            open: false
        };
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

    render: function() {
        var dropdown;
        if (this.state.open) {
            dropdown = (
                <div className="person-menu">
                    <ul>
                        <li><a>Settings</a></li>
                        <li><CQLink href="/quiz/help">Help</CQLink></li>
                        <li><a onClick={this.handleLogout}>Logout</a></li>
                    </ul>
                </div>
            );
        }
        return (
            <li>
                <div className="navbar-dropdown" onMouseOver={this.handleOver} onMouseOut={this.handleOut}>
                    Hi user! <i className="fa fa-caret-down"></i>
                    {dropdown}
                </div>
            </li>
        );
    }

});

module.exports = CQHeaderDropdown;
