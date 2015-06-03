var React = require('react');
var assign = require('object-assign');
var CQZzishLogin = require('./CQZzishLogin');

var CQLoginForm = React.createClass({

    propTypes: {
        onSubmit: React.PropTypes.func,
        showPasswordField: React.PropTypes.bool,
        enabled: React.PropTypes.bool,
        buttonLabel: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            onSubmit: function(){},
            buttonLabel: 'Log In',
            showPasswordField: true,
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

        if (this.props.showPasswordField) {
            newState.isReady = newState.email.length > 0 && newState.password.length > 0;
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

        var passwordField;

        if (this.props.showPasswordField){
            passwordField = (<span id="passwordSpan">
                <label className="control-label col-sm-3">Password</label>
                <div className="col-sm-9">
                    <input id="password"
                        type="password"
                        value={this.state.password}
                        onChange={this.handleChange.bind(this, 'password')}
                        ng-model="login.password"
                        className="form-control ng-pristine ng-valid"/>
                    <br/>

                </div>
            </span>);
        }
        return (
            <form role="form" className="form-horizontal" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label className="col-sm-3 control-label">Email:</label>
                    <div className="col-sm-9">
                        <input id="email" type="email"
                            on-enter="login.focusPassword();"
                            value={this.state.email}
                            onChange={this.handleChange.bind(this, 'email')}
                            placeholder="e.g. abc@zzish.com"
                            autofocus="true"
                            className="form-control ng-pristine ng-valid"/>

                        <br/>

                    </div>

                    {passwordField}

                    <div className="col-sm-8">
                        {this.props.children}
                    </div>
                    <div className="col-sm-4">
                        <button ng-click="login.login();"
                            disabled={!this.state.isReady || !this.props.enabled}
                            type='submit'
                            className="btn btn-primary btn-block">

                            <span>{this.state.buttonLabel}</span>

                        </button>

                    </div>


                    <div className="col-xs-12">
                        <br/>
                        <hr/>
                    </div>
                    <div className="col-sm-4 col-sm-offset-4">
                        <center>
                            <strong>or</strong>
                            <br/>
                            <br/>
                            <CQZzishLogin/>

                        </center>
                    </div>
                    <div className="col-xs-8 col-xs-offset-2">
                        <br/>
                        <center>
                            <p>Zzish is a universal teacher dashboard and unified student login system for educational software</p>
                        </center>
                    </div>
                </div>
            </form>
        );
    }

});

module.exports = CQLoginForm;
