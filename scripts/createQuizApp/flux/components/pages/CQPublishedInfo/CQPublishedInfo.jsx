var React = require('react');

var CQPageTemplate = require('createQuizApp/flux/components/CQPageTemplate');

var GroupActions = require('createQuizApp/flux/actions/GroupActions');
var GroupStore  = require('createQuizApp/flux/stores/GroupStore');
var QuizStore  = require('createQuizApp/flux/stores/QuizStore');
var QuizActions = require('createQuizApp/flux/actions/QuizActions');
var swal = require('sweetalert/dist/sweetalert-dev');
require('sweetalert/dev/sweetalert.scss');

console.log('swal?', swal);

var CQNotFound = React.createClass({

    propTypes: {
        classCode: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            classLink: undefined
        };
    },

    componentDidMount: function() {
        GroupActions.loadGroups();

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
        console.log('groups', groups, groupsContent);
        var currentClass = groups.filter( g => g.code === this.props.classCode)[0];
        var currentQuiz = quizzes.filter(q => q.uuid === this.props.quizId)[0];
        var classLink = currentClass ? currentClass.link : undefined;

        // self.shareLink = "http://quizalize.com/quiz#/share/"+result.shareLink;


        var newState = {
            groups,
            groupsContent,
            quizzes,
            currentClass,
            classLink,
            currentQuiz
        };

        return newState;

    },


    onChange: function(){
        this.setState(this.getState());
    },

    handleShare: function(){

        if (this.state.shareEmails.length > 0){
            // quizId, quizName, emails, link
            var currentQuiz = this.state.currentQuiz;
            QuizActions.shareQuiz(currentQuiz.uuid, currentQuiz.name, this.state.shareEmails);
        }
        console.log('sharing?', this.state.shareEmails);
        swal('Sharing Error', 'You must specify at least one email to share with');
    },

    handleShareEmails: function(ev){
        this.setState({shareEmails: ev.target.value});
    },

    render: function() {
        return (
            <CQPageTemplate className="container">

                <div ng-show="ctrl.published" className="quiz-preview">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="border-block">
                                <center>
                                    <h1>Players get ready!</h1>
                                    <h3>Browse to <strong>http://<span old-style="color: red; font-size: 32px">quizal.me</span></strong><br/>and join this class</h3>
                                    <center>
                                        <div className="class-code">
                                            {this.props.classCode}
                                        </div>
                                    </center><br/>
                                    <p old-style="margin-bottom: 18.5px">You can play on any mobile, tablet or computer.</p>
                                </center>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="border-block">
                                <center>
                                    <h1>Teacher get ready!</h1>
                                    <p>Open your learning dashboard here:</p><br/><br/>
                                    <center>
                                        <button type="button" disabled={!this.state.classLink} href={this.state.classLink} target="zzishld" className="btn btn-primary btn-lg">
                                            Open Teacher Dashboard
                                        </button>
                                    </center>
                                    <br/>
                                    <p>You can see live results as your students play.</p>
                                </center>
                            </div>
                        </div>
                    </div><br/><br/>
                    <div ng-hide="ctrl.quiz.publicAssigned || (ctrl.quiz.profileId!=undefined &amp;&amp; ctrl.quiz.profileId!=ctrl.profileId)" className="row">
                        <div className="col-sm-12">
                            <div ng-style="background: #D6EBFF; padding: 10px" className="border-block">
                                <center>
                                    <h1>Share this quiz!</h1>
                                    <p>Enter the email addresses of up to 10 of your colleagues so that they can use this quiz in their class</p>
                                    <div className="row">
                                        <div className="col-sm-11">
                                            <input id="shareEmails"
                                                type="text"
                                                placeholder="charles@zzish.com samir@zzish.com"
                                                value={this.state.shareEmails}
                                                onChange={this.handleShareEmails}
                                                className="form-control"/>
                                        </div>
                                        <div className="col-sm-1">
                                            <a onClick={this.handleShare} className="btn btn-primary">
                                                Share
                                            </a>
                                        </div>
                                    </div><br/><br/>
                                    <p>or share the following link with them</p>
                                    <center>
                                        <p old-style="font-size: 11px"><em>--ctrl.shareLink--</em></p>
                                    </center>
                                </center>
                            </div>
                        </div>
                    </div>
                </div>

            </CQPageTemplate>
        );
    }

});

module.exports = CQNotFound;
