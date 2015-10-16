/* @flow */
import React from 'react';

import { UserStore } from './../../../stores';
// import UserActions from './../../../actions/UserActions';

import CQDashboardProfile from './extra/CQDashboardProfile';
import CQDashboardQuizzes from './extra/CQDashboardQuizzes';


import { CQPageTemplate } from './../../../components';

var CQDashboard = React.createClass({

    propTypes: {
        authorId: React.PropTypes.string
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        UserStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        UserStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(): any{
        var user;
        if (this.props.authorId){
            user = UserStore.getPublicUser(this.props.authorId);
        } else {
            user = UserStore.getUser();
        }

        return {
            user
        };
    },

    render: function() {

        return (
            <CQPageTemplate>
                <div className="container">
                    <div className="cq-dashboard">
                        <CQDashboardProfile user={this.state.user}/>
                        <div className="cq-dashboard__dashboard">
                            <CQDashboardQuizzes user={this.state.user}/>

                        </div>
                    </div>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQDashboard;
