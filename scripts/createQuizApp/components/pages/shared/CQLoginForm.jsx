var React = require('react');
var assign = require('object-assign');
var CQZzishLogin = require('./CQZzishLogin');

var CQLoginForm = React.createClass({

    propTypes: {
        onSubmit: React.PropTypes.func,
        showPasswordField: React.PropTypes.bool,
        showEmailField: React.PropTypes.bool,
        enabled: React.PropTypes.bool,
        buttonLabel: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            onSubmit: function(){},
            buttonLabel: 'Log In',
            showPasswordField: true,
            showEmailField: true,
            enabled: true
        };
    },

    getInitialState: function() {
        return {
            email: '',
            password: '',
            isReady: false,
            buttonLabel: this.props.buttonLabel
        };
    },

    componentWillReceiveProps: function(nextProps) {
        if (nextProps.enabled === true) {
            this.setState({buttonLabel: nextProps.buttonLable});
        }
    },


    handleChange: function(property, event) {

        var newState = assign({}, this.state);
        newState[property] = event.target.value;

        if (this.props.showPasswordField && this.props.showEmailField) {
            newState.isReady = newState.email.length > 0 && newState.password.length > 0;

        } else if(this.props.showPasswordField && !this.props.showEmailField) {
            newState.isReady = newState.password.length > 0;
        } else {
            newState.isReady = newState.email.length > 0;
        }

        this.setState(newState);
    },



    handleSubmit: function(e){
        e.preventDefault();
        if (this.state.isReady){
            this.props.onSubmit({
                email: this.state.email,
                password: this.state.password
            });
        }

        this.setState({buttonLabel: 'Working…'});

    },


    render: function() {

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
                    <label className="cq-login__email__label control-label">Email:</label>
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
            <form role="form" className="form-horizontal" onSubmit={this.handleSubmit}>

                {emailField}
                {passwordField}

                <div className="cq-login__cta">

                    <div className="cq-login__extra">
                        {this.props.children}
                    </div>
                    <div className="cq-login__button">
                        <button
                            disabled={!this.state.isReady || !this.props.enabled}
                            type='submit'
                            className="btn btn-primary btn-block">

                            <span>{this.props.buttonLabel}</span>
                        </button>

                    </div>
                </div>




                <div className="cq-login__zzish">
                    <div className="cq-login__zzish__header">
                        or
                    </div>
                    <CQZzishLogin/>
                    <div className="cq-login__zzish__footer">
                        <p>Zzish is a universal teacher dashboard and unified login system for educational software</p>
                    </div>

                </div>



            </form>
        );
    }

});

module.exports = CQLoginForm;
