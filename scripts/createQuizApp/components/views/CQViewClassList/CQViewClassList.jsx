var React = require('react');
var router = require('createQuizApp/config/router');

var GroupStore  = require('createQuizApp/stores/GroupStore');
var GroupActions = require('createQuizApp/actions/GroupActions');
var UserApi = require('createQuizApp/actions/api/UserApi');
var QuizActions = require('createQuizApp/actions/QuizActions');

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
        var quizId = this.props.quizId;
        QuizActions.loadQuiz(quizId).then( (quiz) => {
            if (!quiz.meta.name || quiz.meta.name.length === 0) {
                swal(
                    {   title: "Please specify a quiz name",
                        text: "Your students will be able to identify it easier",
                        type: "input",
                        showCancelButton: true,
                        closeOnConfirm: false,
                        closeOnCancel: false,
                        animation: "slide-from-top",
                        inputPlaceholder: "e.g. End of Unit Quiz"
                    },
                function(inputValue) {
                    if (inputValue === false) {
                        swal({
                                title: "Error",
                                text: "You will need to specifiy a quiz name to continue"
                            },function() {
                                router.setRoute("/quiz/quizzes");
                            });
                        return false;
                    }
                    else if (inputValue === "") {
                        swal.showInputError("Please specify a quiz name to continue");
                        return false;
                    }
                    else {

                            quiz.meta.name = inputValue;
                            QuizActions.newQuiz(quiz).then( ()=> {
                                swal("Thanks!", "You can now use this quiz in your class");
                            });
                        }
                    });
            }
        });
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
                UserApi.trackEvent('assign_class', {uuid: response.groupCode});
                router.setRoute(`/quiz/published/${response.content.uuid}/${response.groupCode}/info`);
            });
    },

    handleClassName: function(ev){
        console.log('handleClassName', ev.target.value);
        this.setState({
            newClassName: ev.target.value,
            canSaveNewClass: ev.target.value.length > 0,
            groupsUsed: []
        });
    },

    handleNewClass: function(ev){
        ev.preventDefault();

        var className = this.state.newClassName;
        if (className.length > 0) {

            GroupActions.publishNewAssignment(this.props.quizId, className)
                .then((response) =>{
                    UserApi.trackEvent('new_class', {uuid: response.groupCode, name: className});
                    UserApi.trackEvent('assign_class', {uuid: response.groupCode});
                    router.setRoute(`/quiz/published/${response.content.uuid}/${response.groupCode}/info`);
                });
            this.setState({
                newClassName: '',
                canSaveNewClass: false
            });
        }
    },

    render: function() {
        var newTitle = "Create a new class";
        var existingClasses = (() => {            
            if (this._showGroupsList().length > 0) {
                newTitle = "...or create a new class";
                return (<div>
                    <h4>Your current classes:</h4>
                    <ul className="list-unstyled">
                        {this._showGroupsList().map( (classN) => {
                            return (
                                <li key={classN.value}>
                                    <input type="radio"
                                        name="classSelection"
                                        id={classN.value}
                                        checked={this.state.groupsUsed.indexOf(classN.value) !== -1}
                                        onChange={this.handleClick.bind(this, classN.value)}
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
                </div>);
            }
        });


        return (
            <div className='cq-viewclass'>
                <h3>
                    <span className="cq-viewclass__icon">
                        <i className="fa fa-users"></i>
                    </span>Set as a class game (or homework)…
                </h3>
                <div className="cq-viewclass__list">
                    {existingClasses()}
                    <h4>{newTitle}</h4>
                    <form className="form-inline cq-viewclass__new" onSubmit={this.handleNewClass}>
                        <input
                            id='newClassBox'
                            type="text"
                            className="form-control"
                            value={this.state.newClassName}
                            onChange={this.handleClassName}
                            placeholder="new class name"/>
                        <button className={this.state.canSaveNewClass ? "btn btn-primary" : "btn btn-default"}
                            id='createNewClass'
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
