var React = require('react');


var token;

var pathArray = location.href.split( '/' );
var protocol = pathArray[0];
var host = pathArray[2];
var url = protocol + '//' + host;

var login = function (postfix) {
    var type = "redirect"; //can be a popup instead

    //represents a user (that may be a zzish login)
    var userId = localStorage.getItem("userId");
    if (userId === null) {
        //assume no token
        localStorage.removeItem("token");
        Zzish.login(type, url + postfix);
    }
    else {
        //just go to the logged in url
        location.href = url + postfix;
    }
};

var logout = function(postfix) {
    token = localStorage.getItem("token");
    $("#LoginButton").attr("href", "/quiz#/login");
    if (token !== null) {
        Zzish.logout(token, function() {
            localStorage.clear();
            if (postfix !== undefined) {
                location.href = postfix;
            }
        });
    }
    else {
        localStorage.clear();
        if (postfix !== undefined) {
            location.href = postfix;
        }
    }
};


var CQZzishLogin = React.createClass({

    handleLogin: function(){
        login('/quiz/');
    },

    render: function() {
        return (
            <a onClick={this.handleLogin}
                id="LoginWithZzishButton"
                className="login-zzish btn btn-info btn-block">
                Login with Zzish
            </a>
        );
    }

});

module.exports = CQZzishLogin;
