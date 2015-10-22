/* @flow */
import React from 'react';

import {
    CQPageTemplate,
    CQLoginForm,
    CQLink
} from './../../../components';

import { UserActions } from './../../../actions';


var CQRecoverPassword = React.createClass({

    getInitialState: function() {
        return {
            email: '',
            password: ''
        };
    },

    handleSubmit: function(data : Object) {

        // expects data as an object with
        // email and password
        UserActions.recover(data.email);
        swal('Reset Password', 'If you are registered, please check your email for instructions on how to reset your password', 'success');


    },


    render: function() {
        return (
            <CQPageTemplate className="cq-login">

                <div className="cq-login__inner">
                    <h2 id="title" className="cq-login__header">Password Reset</h2>
                        <CQLoginForm
                            showPasswordField={false}
                            onSubmit={this.handleSubmit}
                            buttonLabel="Reset Password">

                            <div className="">
                                Don't have an account?&nbsp;
                                <CQLink href="/quiz/register">Sign Up</CQLink>
                            </div>
                            <div>
                                Already registered?&nbsp;
                                <CQLink href="/quiz/login">Log in</CQLink>
                            </div>


                        </CQLoginForm>
                </div>

            </CQPageTemplate>
        );
    }

});

module.exports = CQRecoverPassword;
