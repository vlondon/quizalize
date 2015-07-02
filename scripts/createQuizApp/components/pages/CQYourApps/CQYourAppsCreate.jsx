var React = require('react');
var router = require('createQuizApp/config/router');

var AppStore = require('createQuizApp/stores/AppStore');

var CQViewAppGrid = require('createQuizApp/components/views/CQViewAppGrid');
var CQViewCreateApp = require('createQuizApp/components/views/CQViewCreateApp');
var CQLink = require('createQuizApp/components/utils/CQLink');

var CQYourAppsCreate = React.createClass({

    propTypes: {
        newApp: React.PropTypes.bool
    },

    getInitialState: function() {
        return {
            apps: AppStore.getApps(),
            selectedQuizzes: []
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

        var create = this.props.newApp === true ? <CQViewCreateApp selectedQuizzes={this.state.selectedQuizzes}/> : undefined;

        return (
            <div>
                <CQLink href="/quiz/apps/new" className="btn btn-primary">
                    <i className="fa fa-plus"></i> New app
                </CQLink>

                {create}

            </div>
        );
    }

});

module.exports = CQYourAppsCreate;
