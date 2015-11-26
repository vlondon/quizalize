/* @flow */
import React from 'react';

import router from './../../../config/router';
import PQUserActions from './../../../actions/PQUserActions';
import PQUserStore from './../../../stores/PQUserStore';

const redirectTimeout = 3000;

export default class PQLogin extends React.Component {

    constructor(props:Object){
        super(props);
        this.state = {
            name: '',
            classCode: '',
            userIsLoggedIn: false,
            redirectTimeout: redirectTimeout
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentWillMount() {
        PQUserStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        PQUserStore.removeChangeListener(this.onChange);
    }

    onChange() {
        var user = PQUserStore.getUser();
        console.log('User changed: ', user);
        if (user && user.uuid) {
            this.setState({
                userIsLoggedIn: true
            });
            setTimeout(() => {
                router.setRoute('/play/list');
            }, this.state.redirectTimeout);
        }
    }

    handleChange(field:string, ev:Object){
        var state = Object.assign({}, this.state);
        state[field] = ev.target.value;
        this.setState(state);
    }

    handleSubmit(ev: Object) {
        ev.preventDefault();

        var {name, classCode} = this.state;

        PQUserActions.loginUser(name, classCode);
        console.log('submitting', name, classCode);
    }

    loginForm(): Object {
        return (
            <div className="pq-login-form">
                <h1 className="pq-login__title">Quick Play</h1>

                <form role="form" className="form-horizontal" onSubmit={this.handleSubmit}>
                    <div className="form-group">
                        <label className="col-sm-3 control-label"> <span id="loginField">Name</span></label>

                        <div className="col-sm-9">
                            <input id="name"
                                   type="text"
                                   placeholder="e.g. John Smith"
                                   autofocus="true"
                                   className="form-control"
                                   value={this.state.name}
                                   onChange={this.handleChange.bind(this, 'name')}/>
                            <br/>
                        </div>

                        <div id="classCodeSpan">
                            <label className="control-label col-sm-3">Class Code</label>
                            <div className="col-sm-9">
                                <input id="classcode"
                                       type="text"
                                       placeholder="e.g. 2AEFE"
                                       autoCapitalize="off"
                                       className="form-control"
                                       value={this.state.classCode}
                                       onChange={this.handleChange.bind(this, 'classCode')}/>
                                <br/>
                            </div>
                        </div>

                        <div className="col-sm-4"></div>

                        <div className="col-sm-4">
                            <button id="LoginButton" className="btn btn-primary btn-block">
                                <span>Sign In</span>
                            </button>
                        </div>

                        <div className="col-sm-12">
                            <hr style={{border: '1px solid'}}/>
                        </div>

                        <div className="col-sm-4 col-sm-offset-4">
                            <center>
                                <strong>or</strong>
                                <br /><br />
                                <a href="" id="LoginWithZzishButton" className="btn btn-info btn-block">Login With Zzish</a>
                            </center>
                        </div>

                        <div className="col-xs-8 col-xs-offset-2"><br />
                            <center>
                                <p>Zzish is a universal teacher dashboard and unified student login system for educational software</p>
                            </center>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    loggedIn(): Object {
        return (
            <div>You are logged in and will be redirected in {this.state.redirectTimeout / 1000} seconds.</div>
        );
    }

    render(): any {
        return (
            <div className="pq-login">
                { this.state.userIsLoggedIn ? this.loggedIn() : this.loginForm() }
            </div>
        );
    }
}
