/* @flow */
var React = require('react');
import urlParams from './../../../utils/urlParams';
import UserActions from './../../../actions/UserActions';

var pathArray = location.href.split( '/' );
var protocol = pathArray[0];
var host = pathArray[2];
var url = protocol + '//' + host;
var Zzish = window.Zzish;

var login = function (options) {
    var type = "redirect"; //can be a popup instead
    Zzish.login(type, options);
};

class CQZzishLogin extends React.Component {

    constructor(props: Object){
        super(props);
        let params = urlParams();
        if (params.token){
            if (params.cancel) {
                location.href = '/quiz/login';
            }
            else {
                UserActions.loginWithToken(params.token);
                this.state = {
                    isZzishRedirect: true
                };
            }
        } else {
            this.state = {};
        }
        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(){
        let params = urlParams();
        let redirectUrlParams = params.redirect ? window.encodeURIComponent(params.redirect) : window.encodeURIComponent('/quiz/user');
        let options = {
            classcode: 0,
            optionstoshow: ';teacher;student;',
            redirectURL: `${url}/quiz/login?redirect=${redirectUrlParams}`,
            verify: 0,
            showGoogle: true
        };
        login(options);
    }

    render() : any {
        if (this.state.isZzishRedirect){
            return (<div/>);
        }
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

}

module.exports = CQZzishLogin;
