/* @flow */
import React, { PropTypes } from 'react';
import router from './../../../config/router';

import {
    GroupStore,
    MeStore
}  from './../../../stores';

import {
    GroupActions,
    QuizActions
} from './../../../actions';

import {
    CQLink
} from './../../../components';


import { AnalyticsActions } from './../../../actions';

import type { UserType, QuizSettings } from './../../../../../types';
type Props = {
    quizId: string;
    settings: QuizSettings;
};

type State = {
    newClassName: string;
    canSaveNewClass: boolean;
    groups: Array<Object>;
    groupsUsed: Array<string>;
    user: UserType;
};

export default class CQViewClassList extends React.Component {

    props: Props;
    state: State;

    static propTypes = {
        quizId: PropTypes.string.isRequired,
        settings: PropTypes.object.isRequired
    };

    constructor(props: Props) {
        super(props);
        var initialState = this.getState();
        initialState.newClassName = '';
        initialState.canSaveNewClass = false;
        initialState.groupsUsed = [];


        this.state = initialState;

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
        this._showGroupsList = this._showGroupsList.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleDone = this.handleDone.bind(this);
        this.handleClassName = this.handleClassName.bind(this);
        this.handleNewClass = this.handleNewClass.bind(this);
        this.handleCreateClass = this.handleCreateClass.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleShowPricing = this.handleShowPricing.bind(this);
    }

    componentDidMount() {
        GroupStore.addChangeListener(this.onChange);

    }

    componentWillUnmount() {
        GroupStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState(this.getState());
    }

    getState() : State {
        let state = this.state || {};
        var groups = GroupStore.getGroups();
        var groupsContent = GroupStore.getGroupsContent();
        var quizId = this.props.quizId;

        let isNew = groups.length === 0;
        let name = MeStore.state.name !== null ? MeStore.state.name : 'Quizalize teacher';
        let newClassName = isNew || (state && state.newClassName === '') ? `${name}'s class` : '';

        QuizActions.loadQuiz(quizId).then( (quiz) => {
            if (quiz.payload.questions.length === 0) {
                swal({
                    title: "Error",
                    text: "You need at least one question in order to be able to play this quiz"
                }, function() {
                    router.setRoute(`/quiz/create/${quiz.uuid}`);
                });
            }
            else if (!quiz.meta.name || quiz.meta.name.length === 0) {
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
                                router.setRoute("/quiz/user");
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
        // group code
        var groupsUsed = groups
            .filter( g => {
                var content = groupsContent.filter(c => c.contentId === this.props.quizId && c.groupCode === g.code);
                return content.length > 0;
            })
            .map(g => g.code);

        if (groupsUsed.length === 0 && isNew === false) {
            groupsUsed = [groups[0].code];
        }

        let canSaveNewClass = newClassName.length > 0;

        if (isNew && this.refs.newClassBox){
            setTimeout(()=>{
                this.refs.newClassBox.setSelectionRange(0, this.refs.newClassBox.value.length);
            });
        }
        let user = MeStore.state;
        return { groups, groupsUsed, newClassName, canSaveNewClass, isNew , user };
    }

    _showGroupsList(): Array<Object>{

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

    }

    handleClick(classCode: string){
        var groupsUsed = [classCode];
        var newClassName = '';
        var canSaveNewClass = false;
        this.setState({ groupsUsed, newClassName, canSaveNewClass });
    }

    handleDone() {
        if (this.state.groupsUsed.length === 0) {
            this.state.groupsUsed[0] = this.state.groups[this.state.groups.length -1].code;
        }
        console.log("publish assignment settings", this.props.settings.toObject());
        GroupActions.publishAssignment(this.props.quizId, this.state.groupsUsed[0], this.props.settings)
            .then((response) =>{
                AnalyticsActions.sendEvent('class', 'assign', response.groupCode);
                AnalyticsActions.sendIntercomEvent('assign_class', {uuid: response.groupCode});
                router.setRoute(`/quiz/published/${response.content.uuid}/${response.groupCode}/info`);
            });
    }

    handleClassName(ev: Object){
        this.setState({
            newClassName: ev.target.value,
            canSaveNewClass: ev.target.value.length > 0,
            groupsUsed: []
        });
    }

    handleNewClass(ev: Object){
        ev.preventDefault();

        var className = this.state.newClassName;
        if (className.length > 0) {

            GroupActions.publishNewAssignment(this.props.quizId, className)
                .then((response) =>{
                    AnalyticsActions.sendIntercomEvent('new_class', {uuid: response.groupCode, name: className});
                    AnalyticsActions.sendIntercomEvent('assign_class', {uuid: response.groupCode, name: className});
                    router.setRoute(`/quiz/published/${response.content.uuid}/${response.groupCode}/info`);
                });
            this.setState({
                newClassName: '',
                canSaveNewClass: false
            });
        }
    }

    handleCancel() {
        this.setState({isNew: false});
    }

    handleViewInfo(){
        AnalyticsActions.sendEvent('assign_class', 'action', 'watch_info');
        AnalyticsActions.sendIntercomEvent('assign_class_action', {watch_info: true});
    }

    handleClose(){
        AnalyticsActions.sendEvent('assign_class', 'action', 'go_back_clicked');
        AnalyticsActions.sendIntercomEvent('assign_class_action', {go_back_clicked: true});
        router.goBack();
    }

    handleCreateClass() {
        if (MeStore.state.attributes.accountType === 0) {
            //non premium
            this.setState({isPremium: false});
        }
        else {
            //this.setState({isNew: true});
            this.setState({
                isPremium: true,
                isNew: true
            });
        }
    }

    handleShowPricing() {
        router.setRoute('/quiz/premium');
    }

    render() : any {

        var existingClasses, newClass, signUpFoPremium;
        if (this._showGroupsList().length > 0 && !this.state.isNew && !this.state.isPremium) {
            // newTitle = "...or create a new class";
            existingClasses = (
                <div>
                    <h3>
                        Set this as a class game (or homework) for
                    </h3>
                    <ul className="list-unstyled">
                        {this._showGroupsList().map( (classN) => {
                            return (
                                <li key={classN.value}>
                                    <input type="radio"
                                        name="classSelection"
                                        id={classN.value}
                                        checked={!this.state.groupsUsed || this.state.groupsUsed.length === 0 ? true : this.state.groupsUsed[0] === classN.value}
                                        onChange={this.handleClick.bind(this, classN.value)}
                                        />
                                    <label htmlFor={classN.value}>
                                        &nbsp;{classN.label}
                                    </label>
                                </li>
                            );
                        })}
                        <button type="button" className={true ? "cq-viewclass__continue--enabled" : "cq-viewclass__continue--disabled"}
                            onClick={this.handleDone}
                            id='continue'>
                            <i className="fa fa-chevron-right cq-viewclass__continue__chevron"/>
                            Continue
                        </button>
                        <button type="button" className={true ? "cq-viewclass__continue--enabled" : "cq-viewclass__continue--disabled"}
                            onClick={this.handleCreateClass}
                            id='continue'>
                            Use with another class
                        </button>
                    </ul>
                    <div className="cq-viewclass__extra">
                        <p>
                            <a href="https://youtu.be/jmgMbEzkRUA?t=1m43s" target="_blank" onClick={this.handleViewInfo}>
                                See how to play and what you'll need…
                            </a>
                        </p>
                    </div>
                </div>
            );
        }

        if (this.state.isNew) {
            newClass = (
                <div>
                    <h3>
                        Set this as a class game (or homework) for
                    </h3>
                    <p>Type the name of your class</p>
                    <form className="cq-viewclass__new" onSubmit={this.handleNewClass}>
                        <input
                            id='newClassBox'
                            type="text"
                            ref='newClassBox'
                            className=""
                            value={this.state.newClassName}
                            onChange={this.handleClassName}
                            placeholder="New class name"/>
                        <button className={this.state.canSaveNewClass ? "cq-viewclass__save--enabled" : "cq-viewclass__save--disabled"}
                            id='createNewClass'
                            type="submit"
                            disabled={!this.state.canSaveNewClass}>
                            Continue
                        </button>
                    </form>
                    <div>
                        or <CQLink href="#" onClick={this.handleCancel}>cancel</CQLink>
                    </div>
                    <div className="cq-viewclass__extra">
                        <p>
                            <a href="https://youtu.be/jmgMbEzkRUA?t=1m43s" target="_blank" onClick={this.handleViewInfo}>
                                See how to play and what you'll need…
                            </a>
                        </p>
                    </div>
                </div>
            );
        }

        if (this.state.isPremium === false) {
            signUpFoPremium = (
                <div>
                    <h4>You can add more classes with the premium version and a whole lot more, including…</h4>
                    <ul>
                        <li>unlimited quizzes</li>
                        <li>unlimited classes</li>
                        <li>view all your quizzes and track progress</li>
                    </ul>
                    <form className="cq-viewclass__new" onSubmit={this.handleNewClass}>
                        <button type="button" className={true ? "cq-viewclass__continue--enabled" : "cq-viewclass__continue--disabled"}
                            onClick={this.handleShowPricing}
                            id='continue'>
                            <i className="fa fa-chevron-right cq-viewclass__continue__chevron"/>
                            Plans and pricing
                        </button>
                    </form>
                </div>
            );
        }



        return (
            <div className='cq-viewclass'>
                <div className="cq-viewclass__close" onClick={this.handleClose}>
                    <div className="fa fa-times"></div>
                </div>
                <div className="cq-viewclass__list">
                    {existingClasses}
                    {newClass}
                    {signUpFoPremium}
                </div>
            </div>
        );
    }

}
