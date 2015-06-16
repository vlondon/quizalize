var React = require('react');

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

    render: function() {

        var profilePicture = function(picture){
            return {
                backgroundImage: `url(http://www.gravatar.com/avatar/${picture}?s=220&d=identicon)`
            };
        };

        var categoryName = function(quiz){
            if (quiz.category && quiz.category.name){
                return (<span className="cq-public__quizcategory">{quiz.category.name}</span>);
            }
            return undefined;
        };
        return (
            <ul className={`app-grid ${this.props.className}`}>
                {this.state.apps.map((app, key) => {
                    console.log('appp', app);
                    return (
                        <li className="cq-public__app" key={key}>
                            <CQQuizIcon className="cq-public__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                            <div className="cq-public__appdetails">
                                <div className="cq-public__appname">{app.meta.name}</div>
                                <div className="cq-public__appauthor">
                                    <div>by</div>
                                    <div className="cq-public__appauthor--avatar"/>

                                </div>

                                <div className="cq-public__quizextra">
                                    <span className="cq-public__quizcategory">7-11</span>
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
