var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');

var GroupActions = require('createQuizApp/actions/GroupActions');
var GroupStore  = require('createQuizApp/stores/GroupStore');
var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore  = require('createQuizApp/stores/QuizStore');

var CQAssignments = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {

        QuizActions.loadPublicQuizzes();
        GroupStore.addChangeListener(this.onChange);
        QuizStore.addChangeListener(this.onChange);

    },

    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
        QuizStore.removeChangeListener(this.onChange);
    },

    getState: function(){
        var groups = GroupStore.getGroups();
        var groupsContent = GroupStore.getGroupsContent();
        var quizzes = QuizStore.getQuizzes();
        var publicQuizzes = QuizStore.getPublicQuizzes();
        console.log('groups', groups, groupsContent);
        var newState = { groups, groupsContent, quizzes, publicQuizzes };

        return newState;

    },

    _getAssignments: function(groupCode){
        console.log('checking', groupCode, this.state.groupsContent);
        if (this.state.groupsContent && this.state.quizzes){

            var quizIds = this.state.groupsContent.map(c => {
                if (c.groupCode === groupCode) {
                    return c.contentId;
                }
            });
            var quizzes = this.state.quizzes.filter(q => quizIds.indexOf(q.uuid) > -1);
            var publicQuizzes = this.state.publicQuizzes.filter(q => quizIds.indexOf(q.uuid) > -1);
            console.log('quizIds??', quizIds);
            console.log('publicQuizzes??', quizzes);
            return quizzes;
        }
        return [];
    },

    onChange: function(){
        this.setState(this.getState());
    },

    handleUnpublish: function(quizId, groupCode){
        console.log('about to unpublish', quizId, groupCode);
        GroupActions.unpublishQuiz(quizId, groupCode);
    },

    render: function() {
        return (
            <CQPageTemplate className="container">
                <div className="container">
                    <h2>Your Assigned Quizzes</h2>
                    <p>Here are the quizzes that each of your class can play</p>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="row">
                                {this.state.groups.map(classN => {
                                    return (

                                        <div ng-repeat="class in quizzes.classList track by $index" ng-style="padding-bottom: 10px" className="row well">
                                            <div className="col-xs-12">
                                                <h3>{classN.name}
                                                    <a href={classN.link} target="_blank" ng-style="padding: 10px" className="btn btn-info pull-right">Open {classN.name} Dashboard</a>
                                                </h3>
                                                <p ng-style="color: #2a7ed0; font-size: 16px">
                                                    Your Class Code: {classN.code}
                                                </p><br/>
                                                <div ng-show="!quizzes.groupContents[class.code] || quizzes.groupContents[class.code].contents.length==0" className="row">
                                                    <div className="col-xs-12">
                                                        <p>You don't have any quizzes assigned to this class.</p>
                                                    </div>
                                                </div>
                                                {this._getAssignments(classN.code).map(assignment =>{
                                                    return (
                                                        <div ng-repeat="content in quizzes.groupContents[class.code].contents track by $index" ng-style="padding-bottom: 10px" className="row">
                                                            <div className="col-xs-5">
                                                                <h4>{assignment.name}</h4>
                                                            </div>
                                                            <div className="col-xs-3">
                                                                <h4>{assignment.category.name}</h4>
                                                            </div>
                                                            <div className="col-xs-2">
                                                                <CQLink href={`/quiz/published/${assignment.uuid}/${classN.code}/info`}>

                                                                    <button
                                                                        className="btn">
                                                                        View info
                                                                    </button>
                                                                </CQLink>
                                                            </div>
                                                            <div className="col-xs-2">
                                                                <button
                                                                    onClick={this.handleUnpublish.bind(this, assignment.uuid, classN.code)}
                                                                    className="btn btn-danger">
                                                                    Unassign
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </CQPageTemplate>
        );
    }

});

module.exports = CQAssignments;
