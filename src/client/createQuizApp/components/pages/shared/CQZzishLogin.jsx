/* @flow */
import React, {PropTypes} from 'react';
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
        console.log('CQZzishLogin');
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
        let buttonText = this.props.isRegister ? 'Sign up using Zzish' : 'Log in using Zzish';
        return (
            <div className="cq-login__zzish">
                <div className="cq-login__zzish__header">
                    Got a Zzish or Google Classroom teacher account?
                </div>
                <a onClick={this.handleLogin}
                    id="LoginWithZzishButton"
                    className="login-zzish btn btn-info">
                    <span className="login-zzish__brand">
                        <img src={require('./../../../../assets/cq-zzish__google.png')} width="25" height="30" alt=""/>
                        <img src={require('./../../../../assets/cq-zzish__zzish.png')} width="30" height="30" alt=""/>
                    </span> {buttonText}
                </a>
                <div className="cq-login__zzish__footer">
                    <p>Zzish is a universal teacher dashboard and unified login system for educational software</p>
                </div>


            </div>
        );
    }

}
CQZzishLogin.propTypes = {
    isRegister: PropTypes.string
};
module.exports = CQZzishLogin;
