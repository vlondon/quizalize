var React = require('react');


var token;

var pathArray = location.href.split( '/' );
var protocol = pathArray[0];
var host = pathArray[2];
var url = protocol + '//' + host;

var login = function (options) {
    var type = "redirect"; //can be a popup instead

    //represents a user (that may be a zzish login)
    var userId = localStorage.getItem("userId");
    if (userId === null) {
        //assume no token
        localStorage.removeItem("token");
        Zzish.login(type, options);
    }
    else {
        //just go to the logged in url
        location.href = url + '/quiz';
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
        var options = {
            classcode: 0,
            optionstoshow: ';teacher;student;',
            redirectURL: url + '/quiz/',
            verify: 0
        };
        login(options);
    },

    render: function() {
        return (
            <div className="cq-login__zzish">
                <div className="cq-login__zzish__header">
                    or
                </div>
                <a onClick={this.handleLogin}
                    id="LoginWithZzishButton"
                    className="login-zzish btn btn-info">
                    Sign up with Zzish
                </a>
                <div className="cq-login__zzish__footer">
                    <p>Zzish is a universal teacher dashboard and unified login system for educational software</p>
                </div>


            </div>
        );
    }

});

module.exports = CQZzishLogin;
