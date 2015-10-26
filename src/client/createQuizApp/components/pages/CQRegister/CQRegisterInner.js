/* @flow */
import React, { PropTypes } from 'react';

import {
    CQLoginForm,
    CQLink,
    CQSettings,
    CQZzishLogin
} from './../../../components';

import { UserActions } from './../../../actions';
import { urlParams } from './../../../utils';

var CQRegisterInner = React.createClass({

    propTypes: {
        showZzish: PropTypes.bool,
        header: PropTypes.any
    },

    getDefaultProps: function(): Object {
        return {
            showZzish: true,
            header: 'Create a Quizalize account'
        };
    },

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
                if (error === 409){
                    swal('Already registered', 'This email has already been used.');
                } else if (error === 412){
                    swal('Already registered with Zzish', 'It looks like you already used this email when registering with Zzish. You can login with those details by clicking on the button below');
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

        var moreInfo, zzishLogin;
        if (this.state.isRedirect && this.props.header === 'Quizalize Registration'){
            moreInfo = (
                <p style={{'textAlign': 'center'}}>
                Before we can continue you'll need to create a new Quizalize account.
                <br/>
                <br/>
            </p>);
        }
        if (this.props.showZzish){
            zzishLogin = (<CQZzishLogin isRegister={true}/>);
        }
        if (this.state.isRegister){

            return (
                <div>

                    <div className="cq-login__inner">
                        <h2 className="cq-login__header" id="title">
                            {this.props.header}
                        </h2>

                        {moreInfo}

                        <CQLoginForm
                            enabled={this.state.isEnabled}
                            onSubmit={this.handleRegister}
                            buttonLabel={this.state.loginButtonLabel}>
                            <div>
                                Already registered? <br/>
                                <CQLink href={`/quiz/login${window.location.search}`}>Log in</CQLink>
                            </div>
                        </CQLoginForm>
                    </div>

                    {zzishLogin}

                </div>
            );
        } else {
            return <CQSettings isRedirect={true} isRegister={true}/>;
        }
    }

});

export default CQRegisterInner;
