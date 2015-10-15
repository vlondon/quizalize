var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');


var GroupActions = require('createQuizApp/actions/GroupActions');
var GroupStore  = require('createQuizApp/stores/GroupStore');
var QuizStore  = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');


var CQPublishedInfo = React.createClass({

    propTypes: {
        classCode: React.PropTypes.string,
        quizId: React.PropTypes.string,
        routeParams: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            classLink: undefined,
            showHelp: true
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

        var currentClass = groups.filter( g => g.code === this.props.routeParams.classCode)[0];
        var currentQuiz = quizzes.filter(q => q.uuid === this.props.routeParams.quizId)[0];

        // var classLink = currentClass ? updateClassLink(currentClass.link) : undefined;
        if (currentClass) {

            var classLink = currentClass ? currentClass.link : undefined;
            var fullLink = currentQuiz ? classLink + '/' + currentQuiz.uuid : classLink;
            //var fullLink = currentClass.link;
            var fullLiveLink = classLink + 'one/';

            var fullLinkBoard = currentQuiz ? classLink + 'board/' + currentQuiz.uuid : classLink + "board/";
        }



        // self.shareLink = "http://quizalize.com/quiz#/share/"+result.shareLink;

        var newState = {
            groups,
            groupsContent,
            quizzes,
            currentClass,
            classLink,
            currentQuiz,
            fullLink,
            fullLiveLink,
            fullLinkBoard
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

        swal('Sharing Error', 'You must specify at least one email to share with');
    },

    handleShareEmails: function(ev){
        this.setState({shareEmails: ev.target.value});
    },

    handleCloseInstructions: function(){
        this.setState({showHelp: false});
    },

    handleOpenInstructions: function(){
        this.setState({showHelp: true});
    },

    render: function() {

        var iframe = this.state.fullLinkBoard ?  <iframe src={this.state.fullLinkBoard} frameborder="0" className="cq-publishedinfo__frame" frameBorder="0"/> : undefined;

        return (
            <CQPageTemplate className="cq-container cq-publishedinfo">
                {iframe}
            </CQPageTemplate>
        );
    }

});

module.exports = CQPublishedInfo;
