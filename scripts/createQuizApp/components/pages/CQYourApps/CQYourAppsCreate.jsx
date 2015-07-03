var React = require('react');
var router = require('createQuizApp/config/router');

var AppStore = require('createQuizApp/stores/AppStore');

var CQViewAppGrid = require('createQuizApp/components/views/CQViewAppGrid');
var CQViewCreateApp = require('createQuizApp/components/views/CQViewCreateApp');
var CQLink = require('createQuizApp/components/utils/CQLink');

var CQYourAppsCreate = React.createClass({

    propTypes: {
        newApp: React.PropTypes.bool,
        appId: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            apps: AppStore.getApps()
        };
    },

    componentWillMount: function() {
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState({
            apps: AppStore.getApps()
        });
    },

    handleApp: function(app){
        console.log('app clicked', app);
        router.setRoute(`/quiz/apps/${app.uuid}`);
    },

    render: function() {

        var edit = this.props.appId ? <CQViewCreateApp appId={this.props.appId}/> : undefined;
        var create = this.props.newApp === true ? <CQViewCreateApp/> : undefined;
        var list = !this.props.newApp && !this.props.appId ? <CQViewAppGrid onClick={this.handleApp} editMode={true} apps={this.state.apps}/> : undefined;
        var newApp = !this.props.newApp && !this.props.appId ? <CQLink href="/quiz/apps/new" className="btn btn-primary"><i className="fa fa-plus"></i> New app</CQLink> : undefined;

        return (
            <div>
                {newApp}
                {edit}
                {create}
                {list}

            </div>
        );
    }

});

module.exports = CQYourAppsCreate;
