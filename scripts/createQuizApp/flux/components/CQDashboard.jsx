var React = require('react');

var UserStore = require('createQuizApp/flux/stores/UserStore');
var UserActions = require('createQuizApp/flux/actions/UserActions');

require('./CQDashboardStyles');

var CQDashboard = React.createClass({

    getInitialState: function() {
        return {
            user: ''
        };
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        console.log('onChange');
        this.setState({user: UserStore.getUser()});
    },

    render: function() {
        return (
            <div className="ql-container">
                <div>Your dashboard {this.state.user}</div>
            </div>
        );
    }

});

module.exports = CQDashboard;
