var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');

var GroupActions = require('createQuizApp/actions/GroupActions');
var GroupStore  = require('createQuizApp/stores/GroupStore');
var QuizStore  = require('createQuizApp/stores/QuizStore');
var TopicStore = require('createQuizApp/stores/TopicStore');

var CQAssignments = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
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
        var selectPublicQuiz = (quizId) => {
            if (typeof this.state.publicQuizzes !== 'object'){
                return [];
            }
            var quizFound;
        };
        // console.log('checking', groupCode);
        if (this.state.groupsContent && this.state.quizzes){

            var quizIds = this.state.groupsContent.map(c => {
                if (c.groupCode === groupCode) {
                    return c.contentId;
                }
            });

            quizIds = quizIds.filter(q => q !== undefined);

            var quizzes = this.state.quizzes.filter(function(q){
                return quizIds.indexOf(q.uuid) !== -1;
            });

            return quizzes;
        }
        return [];
    },

    onChange: function(){
        this.setState(this.getState());
    },

    handleUnpublish: function(quizId, groupCode){
        console.log('about to unpublish', quizId, groupCode);
        GroupActions.unpublishAssignment(quizId, groupCode);
    },

    render: function() {

        return (
            <CQPageTemplate className="cq-container cq-classes">
                <h2 className="cq-classes__header"><i className="fa fa-users"/> Your Classes</h2>
                <p>Here are the quizzes which you have set to your classes</p>

                    {this.state.groups.map(classN => {
                        var noQuizzes;

                        if (this._getAssignments(classN.code).length === 0) {
                            noQuizzes = (<div className="row">
                                <div className="cq-clas">
                                    <p>You don't have any quizzes assigned to this class.</p>
                                </div>
                            </div>);
                        }

                        return (

                            <div className="cq-classes__class">
                                <h3 className="cq-classes__class__name">
                                    {classN.name}
                                    <a href={classN.link} target="_blank" className="btn btn-info pull-right">
                                        Open {classN.name} Dashboard
                                    </a>
                                </h3>
                                <p className="cq-classes__class__code" ng-style="color: #2a7ed0; font-size: 16px">
                                    Your Class Code: {classN.code}
                                </p><br/>
                                    {noQuizzes}
                                    {this._getAssignments(classN.code).map(assignment =>{
                                        return (
                                            <div className="cq-classes__class__assignment">
                                                <div className="cq-classes__class__assignment__name">
                                                    <h4>{assignment.meta.name}</h4>
                                                </div>
                                                <div className="cq-classes__class__assignment__topic">
                                                    <h4>{TopicStore.getTopicName(assignment.meta.categoryId)}</h4>
                                                </div>
                                                <div className="cq-classes__class__assignment__info">
                                                    <CQLink href={`/quiz/published/${assignment.uuid}/${classN.code}/info`}>

                                                        <button
                                                            className="btn btn-default">
                                                            View info
                                                        </button>
                                                    </CQLink>
                                                </div>
                                                <div className="cq-classes__class__assignment__unassign">
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
                        );
                    })}
            </CQPageTemplate>
        );
    }

});

module.exports = CQAssignments;
