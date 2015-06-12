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
                    return (
                        <li className="cq-public__app" key={key}>
                            <CQQuizIcon className="cq-public__appicon" name={app.name} image={app.imageUrl}/>

                            <div className="cq-public__appdetails">
                                <div className="cq-public__appname">{app.name}</div>
                                <div className="cq-public__appauthor">
                                    <div>by</div>
                                    <div className="cq-public__appauthor--avatar" style={profilePicture(app.author.avatar)}/>
                                    <b>{app.author.name}</b>
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
