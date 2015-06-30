var React = require('react');

var AppStore = require('createQuizApp/stores/AppStore');

var CQViewAppGrid = require('createQuizApp/components/views/CQViewAppGrid');
var CQViewCreateApp = require('createQuizApp/components/views/CQViewCreateApp');


var CQYourAppsCreate = React.createClass({
    getInitialState: function() {
        return {
            apps: AppStore.getApps(),
            selectedQuizzes: []
        };
    },

    render: function() {



        return (
            <div>
                <div className="btn btn-primary">
                    <i className="fa fa-plus"></i> New app
                </div>

                <CQViewCreateApp
                    selectedQuizzes={this.state.selectedQuizzes}
                />
                <CQViewAppGrid
                    editMode={true}
                    apps={this.state.apps}/>

            </div>
        );
    }

});

module.exports = CQYourAppsCreate;
