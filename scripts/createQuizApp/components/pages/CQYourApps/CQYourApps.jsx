/* @flow */
var React = require('react');

var UserStore = require('createQuizApp/stores/UserStore');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQYourAppsComingSoon = require('createQuizApp/components/pages/CQYourApps/CQYourAppsComingSoon');
var CQYourAppsCreate = require('createQuizApp/components/pages/CQYourApps/CQYourAppsCreate');

var CQYourApps = React.createClass({

    getInitialState: function() {
        return {
            isAdmin: UserStore.isAdmin()
        };
    },

    render: function() {
        var content = this.state.isAdmin ? <CQYourAppsCreate/> : <CQYourAppsComingSoon/>;
        return (
            <CQPageTemplate className="container cq-yourapps">
                <h2 className='cq-yourapps__header'>
                    <i className="fa fa-archive"/> Your apps
                </h2>
                {content}
            </CQPageTemplate>
        );
    }

});

module.exports = CQYourApps;
