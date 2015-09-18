/* @flow */
var React = require('react');

var CQPageTemplate = require('./../../../components/CQPageTemplate');
var CQLoginForm = require('./../../../components/pages/shared/CQLoginForm');
var CQLink = require('./../../../components/utils/CQLink');
var CQSettings = require('./../../../components/pages/CQSettings');
var CQZzishLogin = require('./../../../components/pages/shared/CQZzishLogin');

var UserActions = require('./../../../actions/UserActions');

import {urlParams} from './../../../utils';

var CQRegister = React.createClass({

    getInitialState: function() {

        var willRedirect = true;
        return {
            isRegister: true,
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

        UserActions.register(data)
            .then(()=>{

                this.setState({isRegister: false});


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
        if (this.state.isRegister){

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

                    <CQZzishLogin/>

                </CQPageTemplate>
            );
        } else {
            return <CQSettings isRedirect={true} isRegister={true}/>;
        }
    }

});

module.exports = CQRegister;
