var React = require('react');

var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');


var CQViewAppGrid = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        apps: React.PropTypes.array
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
            <ul className={`cq-appgrid  ${this.props.className}`}>
                {this.props.apps.map((app, key) => {
                    return (
                        <li className="cq-appgrid__app" key={key}>
                            <CQQuizIcon className="cq-appgrid__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                            <div className="cq-appgrid__appdetails">
                                <div className="cq-appgrid__appname">{app.meta.name}</div>
                            </div>

                        </li>
                    );
                })}
            </ul>
        );
    }

});

module.exports = CQViewAppGrid;
