/* @flow */
var React = require('react');

var UserStore               = require('../../../stores/UserStore');
var CQPageTemplate          = require('../../CQPageTemplate');
var CQYourAppsComingSoon    = require('./CQYourAppsComingSoon');
var CQYourAppsCreate        = require('./CQYourAppsCreate');

var CQYourApps = React.createClass({

    propTypes: {
        newApp: React.PropTypes.bool,
        appId: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            isAdmin: UserStore.isAdmin()
        };
    },

    render: function() {
        var showContent = true;
        var content = showContent ? <CQYourAppsCreate newApp={this.props.newApp} appId={this.props.appId}/> : <CQYourAppsComingSoon/>;
        return (
            <CQPageTemplate className="cq-container cq-yourapps">
                <h2 className='cq-yourapps__header'>
                    <i className="fa fa-archive"/> Your apps
                </h2>
                {content}
            </CQPageTemplate>
        );
    }

});

module.exports = CQYourApps;
