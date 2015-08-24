var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');


var GroupActions = require('createQuizApp/actions/GroupActions');
var GroupStore  = require('createQuizApp/stores/GroupStore');
var QuizStore  = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');



var CQPUblishedInfo = React.createClass({

    propTypes: {
        classCode: React.PropTypes.string,
        quizId: React.PropTypes.string
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
        var fullLink = currentQuiz ? classLink+"/"+currentQuiz.uuid : classLink;

        // self.shareLink = "http://quizalize.com/quiz#/share/"+result.shareLink;


        var newState = {
            groups,
            groupsContent,
            quizzes,
            currentClass,
            classLink,
            currentQuiz,
            fullLink
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
            <CQPageTemplate className="cq-container cq-publishedinfo">

                <div className="cq-publishedinfo__player">
                    <center>
                        <h1>Players get ready!</h1>
                        <h3>Browse to <strong>http://<span old-style="color: red; font-size: 32px">quizal.me</span></strong><br/>and join this class</h3>
                        <center>
                            <div className="class-code">
                                {this.props.classCode}
                            </div>
                        </center><br/>
                        <p>You can play on any mobile, tablet or computer.</p>
                    </center>
                </div>
                <div className="cq-publishedinfo__teacher">
                    <center>
                        <h1>Teacher get ready!</h1>
                        <p>Open your learning dashboard here:</p><br/><br/>
                        <center>
                            <a type="button" id='openDashboard' disabled={!this.state.fullLink} href={this.state.fullLink} target="zzishld" className="btn btn-primary btn-lg">
                                Open Teacher Dashboard
                            </a>
                        </center>
                        <br/>
                        <p>You can see live results as your students play.</p>
                    </center>
                </div>


            </CQPageTemplate>
        );
    }

});

module.exports = CQPUblishedInfo;
