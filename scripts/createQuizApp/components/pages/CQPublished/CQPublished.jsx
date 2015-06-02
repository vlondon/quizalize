var React = require('react');
var router = require('createQuizApp/config/router');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var GroupActions = require('createQuizApp/actions/GroupActions');
var GroupStore  = require('createQuizApp/stores/GroupStore');

var CQCreateMore = require('createQuizApp/components/pages/CQCreate/CQCreateMore');

var CQPublished = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        GroupStore.addChangeListener(this.onChange);
    },
    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
    },

    getState: function(){

        var groups = GroupStore.getGroups();
        var selectedClass = (groups && groups.length > 0) ? groups[0].code : 'new';
        var isMoreVisible = this.state ? this.state.isMoreVisible : false;
        var settings = this.state ? this.state.settings : {};

        var newState = {
            groups,
            selectedClass,
            isMoreVisible,
            settings
        };

        return newState;

    },


    onChange: function(){
        this.setState(this.getState());
    },

    handleChange: function(ev){

        this.setState({
            selectedClass: ev.target.value
        });

    },

    handleNewClassInput: function(ev){
        this.setState({
            newClass: ev.target.value
        });
    },

    _showGroupsList: function(){

        if (!this.state.groups) {
            return [{
                value: null,
                label: 'Loading',
                disabled: true
            }];
        }
        var groupList = this.state.groups.map(g => {
            return {value: g.code, label: g.name};
        });


        groupList.unshift({
            value: 'new',
            label: 'Create a new class…',
            disabled: false
        });


        return groupList;


    },

    handleClick: function(){
        var redirect = function(quizId, classId){
            console.log('should redirect!');
            router.setRoute(`/quiz/published/${quizId}/${classId}/info`);
        };

        console.log('about to publish', this.state.selectedClass);
        if (this.state.selectedClass === 'new') {

            GroupActions.publishNewAssignment(this.props.quizId, this.state.newClass, this.state.settings)
                .then((response) =>{
                    debugger;

                    redirect(this.props.quizId, response.code);

                });

        } else {
            console.log('about to save an already existing class', this.state.selectedClass);
            GroupActions.publishAssignment(this.props.quizId, this.state.selectedClass, this.state.settings)
                .then(()=>{
                    debugger;
                    redirect(this.props.quizId, this.state.selectedClass);
                });
        }
    },

    handleSettings: function(settings){
        console.log('settingsObject', settings);
        this.setState({settings});
    },

    handleMoreClick: function(){
        this.setState({
            isMoreVisible: !this.state.isMoreVisible
        });
    },

    render: function() {


        var classNameForm;

        if (this.state.selectedClass === 'new'){
            classNameForm = (
                <div className="col-sm-12 input">
                    <label className="control-label">Class name</label>
                    <input type="text"
                        className="form-control"
                        onChange={this.handleNewClassInput}
                        value={this.state.newClass}
                    />

                </div>
            );
        } else {
            classNameForm = undefined;
        }

        return (
            <CQPageTemplate className="container cq-published">
                <div className="row well">

                        <div ng-show="!ctrl.publishing &amp;&amp; !ctrl.published" className="col-sm-8 col-sm-offset-2">
                            <h1 className="text-center">Which class should take this quiz?
                                <div role="form" className="form-horizontal"></div>
                            </h1>
                            <p>You can have more than one class with Quizalize. Type in the name of a class should take this quiz. If you type in a new name, you will create a new class. </p>
                            <div className="form-group">
                                <div className="row">

                                    <div className="col-sm-12 input">
                                        <label className="control-label">Select a class name</label>

                                        <select
                                            className="form-control"
                                            value={this.state.selectedClass}
                                            onChange={this.handleChange}>

                                            {this._showGroupsList().map( (classN) => {
                                                return (
                                                    <option
                                                        value={classN.value}
                                                        key={classN.value}
                                                        disabled={classN.disabled}>
                                                        {classN.label}
                                                    </option>
                                                );
                                            })}

                                        </select>
                                    </div>

                                    {classNameForm}

                                </div>
                                <div className="col-sm-3 col-sm-offset-3">
                                    <button type="button"

                                        onClick={this.handleMoreClick}
                                        className={this.state.isMoreVisible ? 'btn btn-block btn-info' : 'btn btn-block'}>
                                        More Settings
                                    </button>
                                </div>
                                <div className="col-sm-3"><br className="visible-xs"/>
                                <button type="button" onClick={this.handleClick}
                                    className="btn btn-block btn-primary">
                                    Play
                                </button>
                            </div>
                            <div className="col-xs-12">
                                <center></center>
                            </div>
                        </div>

                    </div>
                </div>
                {this.state.isMoreVisible ? <CQCreateMore onSettings={this.handleSettings} settings={this.state.settings}/> : undefined }
            </CQPageTemplate>
        );
    }

});

module.exports = CQPublished;
