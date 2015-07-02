/* @flow */
var React = require('react');

var UserStore = require('../../../stores/UserStore');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQYourAppsComingSoon = require('createQuizApp/components/pages/CQYourApps/CQYourAppsComingSoon');
var CQYourAppsCreate = require('createQuizApp/components/pages/CQYourApps/CQYourAppsCreate');

var CQYourApps = React.createClass({

    propTypes: {
        newApp: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            isAdmin: UserStore.isAdmin()
        };
    },

    render: function() {
        var content = this.state.isAdmin ? <CQYourAppsCreate newApp={this.props.newApp}/> : <CQYourAppsComingSoon/>;
        return (
            <CQPageTemplate className="cq-container cq-yourapps">
                <h2 className='cq-yourapps__header'>
                    <i className="fa fa-archive"/> Your apps
                </h2>
                <CQYourAppsCreate newApp={this.props.newApp}/>
            </CQPageTemplate>
        );
    }

});

module.exports = CQYourApps;
