var React = require('react');
var assign = require('object-assign');

var CQLoginForm = React.createClass({

    propTypes: {
        onSubmit: React.PropTypes.func
    },

    getDefaultProps: function() {
        return {
            onSubmit: function(){}
        };
    },

    getInitialState: function() {
        return {
            email: '',
            password: '',
            isReady: false
        };
    },


    handleChange: function(property, event) {

        var newState = assign({}, this.state);
        newState[property] = event.target.value;
        newState.isReady = newState.email.length > 0 && newState.password.length > 0;

        this.setState(newState);
    },



    handleSubmit: function(e){
        e.preventDefault();
        console.log('handle submit', e);
        if (this.state.isReady){
            this.props.onSubmit({
                email: this.state.email,
                password: this.state.password
            });
        }

    },


    render: function() {
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
                    <span id="passwordSpan">
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
                    </span>
                    <div className="col-sm-8">
                        {this.props.children}
                    </div>
                    <div className="col-sm-4">
                        <button ng-click="login.login();"
                            disabled={!this.state.isReady}
                            type='submit'
                            className="btn btn-primary btn-block">

                            <span>Log In</span>

                        </button>

                    </div>


                    <div className="col-xs-12">
                        <br/>
                        <hr/>
                    </div>
                    <div className="col-sm-4 col-sm-offset-4">
                        <center><strong>or</strong><br/><br/><a href="login('/quiz#/')" id="LoginWithZzishButton" className="login-zzish btn btn-info btn-block">Login with Zzish</a></center>
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
