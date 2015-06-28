var React = require('react');
var router = require('createQuizApp/config/router');

var CQViewClassList = require('createQuizApp/components/views/CQViewClassList');
var CQLink = require('createQuizApp/components/utils/CQLink');


var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var GroupActions = require('createQuizApp/actions/GroupActions');
var GroupStore  = require('createQuizApp/stores/GroupStore');
var QuizStore = require('createQuizApp/stores/QuizStore');
var QuizActions = require('createQuizApp/actions/QuizActions');



var CQPublished = React.createClass({

    propTypes: {
        quizId: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        QuizStore.addChangeListener(this.onChangeQuiz);
        GroupStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        QuizStore.addChangeListener(this.onChangeQuiz);
        GroupStore.removeChangeListener(this.onChange);
    },

    getState: function(){

        var groups = GroupStore.getGroups();
        var selectedClass = (groups && groups.length > 0) ? groups[0].code : 'new';
        var isMoreVisible = this.state ? this.state.isMoreVisible : false;
        var quiz = this._getQuiz();
        var settings = quiz.meta;
        var newClass = '';

        var newState = {
            groups,
            selectedClass,
            isMoreVisible,
            settings,
            newClass
        };

        return newState;

    },

    _getQuiz: function(props){
        props = props || this.props;

        var quiz = props.quizId ? QuizStore.getQuiz(props.quizId) : undefined;


        if (quiz === undefined){
            if (this.props.quizId) {
                QuizActions.loadQuiz(this.props.quizId);
            }
            quiz = {
                meta: {
                    name: "",
                    subject: "",
                    category: "",
                    description: undefined,
                    imageUrl: undefined,
                    imageAttribution: undefined,
                    live: false,
                    featured: false,
                    featureDate: undefined,
                    numQuestions: undefined,
                    random: false
                },
                payload: {}
            };

        }


        return quiz;
    },

    onChangeQuiz: function(){
        var newState = this.getState();
        var quiz = this._getQuiz();
        newState.settings = quiz.meta;
        this.setState(newState);
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
                    redirect(this.props.quizId, response.code);
                });

        } else {
            console.log('about to save an already existing class', this.state.selectedClass);
            GroupActions.publishAssignment(this.props.quizId, this.state.selectedClass, this.state.settings)
                .then(()=>{
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

        return (
            <CQPageTemplate className="cq-published">

                <div className="cq-published__header">

                    <h1>
                        All done…
                    </h1>
                    <h3>
                        Your quiz is ready for your class
                    </h3>
                    <p>
                        Too soon? <CQLink>Continue building</CQLink>
                    </p>
                </div>

                <CQViewClassList
                    quizId={this.props.quizId}/>



                <div className="pricing">
                    Set pricing and marketplace options
                </div>
                <div className="share">
                    Share with colleagues (they use it free...)
                </div>
                <div className="preview">
                    Preview
                </div>
                <div className="back">
                    Go back and make changes
                </div>
                <div className="btn btn-default">
                    Close and go to my page
                </div>

            </CQPageTemplate>
        );
    }

});

module.exports = CQPublished;
