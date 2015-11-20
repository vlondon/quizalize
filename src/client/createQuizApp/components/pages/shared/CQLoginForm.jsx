/* @flow */
var React = require('react');


import UserStore from './../../../stores/UserStore';
import UserActions from './../../../actions/UserActions';

type State = {
    email: string;
    password: string;
    isReady: boolean;
    buttonLabel: string;
}
var CQLoginForm = React.createClass({

    propTypes: {
        onSubmit: React.PropTypes.func,
        showPasswordField: React.PropTypes.bool,
        showEmailField: React.PropTypes.bool,
        enabled: React.PropTypes.bool,
        buttonLabel: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ])

    },

    getDefaultProps: function():Object {
        return {
            onSubmit: function(){},
            buttonLabel: 'Log In',
            showPasswordField: true,
            showEmailField: true,
            enabled: true
        };
    },

    getInitialState: function():State {
        let isReady = (this.props.showPasswordField === false && UserStore.getUserLoginEmail().length > 0) ? true : false;

        return {
            email: UserStore.getUserLoginEmail(),
            password: '',
            buttonLabel: this.props.buttonLabel || '',
            isReady,
        };
    },

    componentWillReceiveProps: function(nextProps:Object) {
        if (nextProps.enabled === true) {
            this.setState({buttonLabel: nextProps.buttonLabel});
        }
    },

    handleChange: function(property: string, event: Object) {

        var newState = Object.assign({}, this.state);
        newState[property] = event.target.value;

        if (property === 'email'){
            UserActions.setLoginEmail(event.target.value);
        }

        if (this.props.showPasswordField && this.props.showEmailField) {
            newState.isReady = newState.email.length > 0 && newState.password.length > 0;

        } else if(this.props.showPasswordField && !this.props.showEmailField) {
            newState.isReady = newState.password.length > 0;
        } else {
            newState.isReady = newState.email.length > 0;
        }
        newState.email = newState.email.trim();
        newState.password = newState.password.trim();


        this.setState(newState);
    },



    handleSubmit: function(e: Object){
        e.preventDefault();
        if (this.state.isReady && this.props.onSubmit){
            this.props.onSubmit({
                email: this.state.email,
                password: this.state.password
            });
        }

        this.setState({buttonLabel: 'Working…'});

    },


    render: function():Object {

        var passwordField, emailField;

        if (this.props.showPasswordField){
            passwordField = (
            <div id="passwordSpan" className="cq-login__password">
                <label className="cq-login__password__label control-label ">Password</label>
                <div className="cq-login__password__input">
                    <input id="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange.bind(this, 'password')}
                        ng-model="login.password"
                        className="form-control ng-pristine ng-valid"/>
                    <br/>

                </div>
            </div>);
        }

        if (this.props.showEmailField){
            emailField = (
                <div className="cq-login__email">
                    <label className="cq-login__email__label control-label">Email</label>
                    <div className="cq-login__email__input">
                        <input id="email" type="email"
                            on-enter="login.focusPassword();"
                            value={this.state.email}
                            onChange={this.handleChange.bind(this, 'email')}
                            placeholder="e.g. abc@zzish.com"
                            autofocus="true"
                            className="form-control ng-pristine ng-valid"/>


                    </div>
            </div>);
        }
        return (
            <form role="form" className="cq-login__form form-horizontal" onSubmit={this.handleSubmit}>


                <div className="cq-login__cta">
                    {emailField}
                    {passwordField}

                    <div className="cq-login__button">
                        <button
                            disabled={!this.state.isReady || !this.props.enabled}
                            type='submit'
                            id='loginButton'
                            className="btn btn-primary btn-block">

                            <span>{this.props.buttonLabel}</span>
                        </button>

                    </div>
                    <div className="cq-login__extra">
                        {this.props.children}
                    </div>
                </div>




            </form>
        );
    }

});

module.exports = CQLoginForm;
