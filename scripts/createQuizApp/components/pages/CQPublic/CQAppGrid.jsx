var React = require('react');
var router = require('createQuizApp/config/router');

var AppStore = require('createQuizApp/stores/AppStore');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQSpinner = require('createQuizApp/components/utils/CQSpinner');

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
        AppStore.removeChangeListener(this.onChange);
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

        var emptyState = this.state.apps && this.state.apps.length === 0;
        var loading = this.state.apps === undefined;

        if (loading){
            return (
                <ul className={`cq-appgrid empty ${this.props.className}`}>
                    <CQSpinner/>
                </ul>
            );
        } else if (emptyState){
            // <h4>
            //     <CQLink href="/quiz/create">
            //         Why don't you create a new one?
            //     </CQLink>
            // </h4>
            return (
                <ul className={`cq-appgrid empty ${this.props.className}`}>
                    <div className="cq-appgrid__appicon empty"></div>
                    <h3>
                        No apps have been found.
                    </h3>
                </ul>
            );
        } else {
            var howManyQuizzes = function(n){
                if (n === 1){
                    return n + ' Quiz';
                }
                return n + ' Quizzes';
            };
            return (
                <ul className={`cq-appgrid ${this.props.className}`}>
                    {this.state.apps.map((app, key) => {
                        return (
                            <li className="cq-appgrid__app" key={key} onClick={this.handleClick.bind(this, app)}>
                                <CQQuizIcon className="cq-appgrid__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                                <div className="cq-appgrid__appdetails">
                                    <div className="cq-appgrid__appname">
                                        {app.meta.name}
                                    </div>
                                    <div className="cq-appgrid__appquizzes">
                                        {howManyQuizzes(app.meta.quizzes.length)}
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


    }

});

module.exports = CQAppGrid;
