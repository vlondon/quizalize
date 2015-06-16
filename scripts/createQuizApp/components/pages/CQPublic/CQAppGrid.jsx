var React = require('react');
var router = require('createQuizApp/config/router');

var AppStore = require('createQuizApp/stores/AppStore');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');

var CQAppGrid = React.createClass({

    propTypes: {
        className: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            apps: AppStore.getPublicApps()
        };
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AppStore.addChangeListener(this.onChange);
    },

    onChange: function(){
        var apps = AppStore.getPublicApps();
        this.setState({apps});
    },

    handleClick: function(app){
        console.log('app clicked', app);
        router.setRoute(`/quiz/app/${app.uuid}`);
    },

    render: function() {

        var profilePicture = function(picture){
            return {
                backgroundImage: `url(http://www.gravatar.com/avatar/${picture}?s=220&d=identicon)`
            };
        };

        var categoryName = function(quiz){
            if (quiz.category && quiz.category.name){
                return (<span className="cq-appgrid__quizcategory">{quiz.category.name}</span>);
            }
            return undefined;
        };
        return (
            <ul className={`cq-appgrid ${this.props.className}`}>
                {this.state.apps.map((app, key) => {
                    console.log('appp', app);
                    return (
                        <li className="cq-appgrid__app" key={key} onClick={this.handleClick.bind(this, app)}>
                            <CQQuizIcon className="cq-appgrid__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                            <div className="cq-appgrid__appdetails">
                                <div className="cq-appgrid__appname">
                                    {app.meta.name}
                                </div>
                                <div className="cq-appgrid__appquizzes">
                                    {app.meta.quizzes.length} Quizzes
                                </div>

                                <div className="cq-appgrid__appprice">
                                    Free
                                </div>
                            </div>

                        </li>
                    );
                })}
            </ul>
        );
    }

});

module.exports = CQAppGrid;
