/* @flow */
var React = require('react');

var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQLoginForm = require('./../../../components/pages/shared/CQLoginForm');
var CQLink = require('./../../../components/utils/CQLink');


var UserActions = require('./../../../actions/UserActions');
import router from './../../../config/router';
import {urlParams} from './../../../utils';

var CQRegister = React.createClass({

    getInitialState: function() {
        console.log('window.location.search;,', window.location.search);
        console.log("redirecting to after?", urlParams().redirect);
        var willRedirect = true;
        return {
            isRedirect: urlParams().redirect ? true : false,
            redirectUrl: '',
            isEnabled: true,
            loginButtonLabel: 'Sign up',
            willRedirect
        };
    },

    handleRegister: function(data: Object){
        this.setState({
            isEnabled: false,
            loginButtonLabel: 'Working…'
        });
        var redirect = urlParams().redirect;
        UserActions.register(data)
            .then(()=>{
                if (this.state.willRedirect){
                    if (redirect) {
                        router.setRoute(`/quiz/register-settings?final=true&redirect=${window.encodeURIComponent(redirect)}`);
                    }
                    else {
                        router.setRoute('/quiz/register-settings');
                    }
                } else {
                    router.setRoute('/quiz/quizzes');
                }
            })
            .catch((error) => {
                if (error === 'Duplicate Email address'){
                    swal('Register Error', 'This email has already been used.');
                } else {
                    swal('Register Error', 'Something went wrong, please try again later.');
                }
                this.setState({
                    isEnabled: true,
                    loginButtonLabel: 'Sign up'
                });
            });
    },
    render: function() {

        var moreInfo;
        if (this.state.isRedirect){
            moreInfo = (<p style={{'text-align': 'center'}}>
                Before we can continue you'll need to create a new Quizalize account.
                <br/>
                <br/>
            </p>);
        }
        return (
            <CQPageTemplate className="cq-login">

                <div className="cq-login__inner">
                    <h2 className="cq-login__header" id="title">
                        Quizalize Registration
                    </h2>

                    {moreInfo}

                    <CQLoginForm
                        enabled={this.state.isEnabled}
                        onSubmit={this.handleRegister}
                        buttonLabel={this.state.loginButtonLabel}>
                        <div>
                            Already registered?&nbsp;
                            <CQLink href={`/quiz/login${window.location.search}`}>Log in</CQLink>
                        </div>
                    </CQLoginForm>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQRegister;
