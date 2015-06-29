var React = require('react');

var GroupStore  = require('createQuizApp/stores/GroupStore');
var GroupActions = require('createQuizApp/actions/GroupActions');
var router = require('createQuizApp/config/router');

var CQViewClassList = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        var initialState = this.getState();
        initialState.newClassName = '';
        initialState.canSaveNewClass = false;
        initialState.groupsUsed = [];
        return initialState;
    },
    componentDidMount: function() {
        GroupStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var groups = GroupStore.getGroups();
        var groupsContent = GroupStore.getGroupsContent();
        console.log('groupsContent', groups, groupsContent);
        // group code
        var groupsUsed = groups
            .filter( g => {
                var content = groupsContent.filter(c => c.contentId === this.props.quizId && c.groupCode === g.code);
                return content.length > 0;
            })
            .map(g => g.code);

        return { groups, groupsUsed };
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

        return groupList;

    },

    handleClick: function(classCode, ev){
        var groupsUsed = [classCode];
        var newClassName = '';
        var canSaveNewClass = false;

        this.setState({ groupsUsed, newClassName, canSaveNewClass });
    },


    // handleClick: function(classCode, ev){
    //     // console.log("Here?",classCode,ev);
    //     // var isAssigning = ev.target.checked;
    //     // var groupsUsed = this.state.groupsUsed;
    //     // if (isAssigning){
    //     //     GroupActions.publishAssignment(this.props.quizId, classCode);
    //     //     groupsUsed.push(classCode);
    //     // } else {
    //     //     GroupActions.unpublishAssignment(this.props.quizId, classCode);
    //     //     groupsUsed.splice(groupsUsed.indexOf(classCode), 1);
    //     // }
    //     // this.setState({groupsUsed});

    //     // console.log('classCode', classCode, ev.target.checked);
    // },

    handleDone: function() {
        GroupActions.publishAssignment(this.props.quizId, this.state.groupsUsed[0])
            .then((response) =>{
                router.setRoute(`/quiz/published/${response.content.uuid}/${response.groupCode}/info`);
            });
    },

    handleClassName: function(ev){
        console.log('handleClassName', ev.target.value);
        this.setState({
            newClassName: ev.target.value,
            canSaveNewClass: ev.target.value.length > 3,
            groupsUsed: []
        });
    },

    handleNewClass: function(ev){
        ev.preventDefault();

        var className = this.state.newClassName;
        if (className.length > 3) {
            GroupActions.publishNewAssignment(this.props.quizId, className)
                .then((response) =>{
                    router.setRoute(`/quiz/published/${response.content.uuid}/${response.groupCode}/info`);
                });
            this.setState({
                newClassName: '',
                canSaveNewClass: false
            });
        }
    },

    render: function() {
        return (
            <div className='cq-viewclass'>
                <h3>
                    <span className="cq-viewclass__icon">
                        <i className="fa fa-users"></i>
                    </span> Set as a class game (or homework)…
                </h3>
                <div className="cq-viewclass__list">
                    <ul className="list-unstyled">
                        {this._showGroupsList().map( (classN) => {
                            return (
                                <li key={classN.value}>
                                    <input type="radio"
                                        name="classSelection"
                                        id={classN.value}
                                        checked={this.state.groupsUsed.indexOf(classN.value) !== -1}
                                        onClick={this.handleClick.bind(this, classN.value)}
                                        />
                                    <label htmlFor={classN.value}>
                                        &nbsp;{classN.label}
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                    <button className="btn btn-primary cq-viewclass__done"
                        disabled={this.state.groupsUsed.length === 0}
                        onClick={this.handleDone}>
                        Done - Use this class
                    </button>

                    <form className="form-inline cq-viewclass__new" onSubmit={this.handleNewClass}>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.newClassName}
                            onChange={this.handleClassName}
                            placeholder="Enter a new class name"/>
                        <button className={this.state.canSaveNewClass ? "btn btn-primary" : "btn btn-default"}
                            type="submit"
                            disabled={!this.state.canSaveNewClass}>
                            Create and use in class
                        </button>
                    </form>


                </div>
            </div>
        );
    }

});

module.exports = CQViewClassList;
