var React = require('react');
var AppStore = require('createQuizApp/stores/AppStore');
var TopicStore = require('createQuizApp/stores/TopicStore');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');


var CQApp = React.createClass({

    propTypes: {
        appId: React.PropTypes.string.isRequired
    },

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
        TopicStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var appInfo = AppStore.getAppInfo(this.props.appId);

        if (appInfo.meta && appInfo.meta.colour){
            console.log('new background oclor', appInfo.meta.colour);
            document.body.style.backgroundColor = appInfo.meta.colour;
        };


        return {appInfo};
    },


    render: function() {

        if (this.state.appInfo && this.state.appInfo.meta){

            return (
                <CQPageTemplate className="cq-app">

                    <CQQuizIcon
                        className="cq-app__icon"
                        name={this.state.appInfo.meta.name}
                        image={this.state.appInfo.meta.iconURL}/>

                    <div className="cq-app__info">
                        <h2>{this.state.appInfo.meta.name}</h2>
                        <div className="cq-app__price">Free</div>
                        <button className="cq-app__button">
                            Use for free
                        </button>

                    </div>
                    <div className="cq-app__description">
                        <p>{this.state.appInfo.meta.description}</p>
                    </div>

                    <div className="cq-app__quizlist">
                        <CQViewQuizList quizzes={this.state.appInfo._quizzes}/>
                    </div>
                </CQPageTemplate>
            );
        } else {
            return (<CQPageTemplate/>);
        }
    }

});

module.exports = CQApp;
