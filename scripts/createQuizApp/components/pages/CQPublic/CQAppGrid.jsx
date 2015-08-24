var React = require('react');
var router = require('createQuizApp/config/router');

var AppStore = require('createQuizApp/stores/AppStore');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQSpinner = require('createQuizApp/components/utils/CQSpinner');

var CQPagination = require('createQuizApp/components/utils/CQPagination');

import priceFormat from './../../../utils/priceFormat';

var CQAppGrid = React.createClass({

    propTypes: {
        className: React.PropTypes.string,
        appsPerPage: React.PropTypes.number
    },

    getDefaultProps: function() {
        return {
            appsPerPage: 10,
            className: ''
        };
    },

    getInitialState: function() {
        var initialState = this.getState(undefined, 1);
        return initialState;
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState(this.getState(nextProps));
    },

    componentDidMount: function() {
        AppStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        AppStore.removeChangeListener(this.onChange);
    },

    getState: function(props, page){


        var appCreate = function(apps){
            var appPlaceholder = {
                uuid: 'new',
                meta: {
                    name: 'Create your own App',
                    quizzes: []
                }
            };
            if (apps.filter(a => a.uuid === 'new').length === 0){
                apps.push(appPlaceholder);
            }
            return apps;

        };

        var apps = AppStore.getPublicApps();


        if (apps) {
            apps = appCreate(apps);
            page = page || this.state.page;
            props = props || this.props;

            var appIndexStart = (page - 1) * props.appsPerPage;
            var appIndexEnd = appIndexStart + props.appsPerPage;
            var appsToDisplay = apps.slice(appIndexStart, appIndexEnd);
            var pages = Math.ceil(apps.length / props.appsPerPage);

            if (page > pages) {
                page = 1;
            }
            return {
                apps: appsToDisplay,
                pages,
                page
            };
        } else {
            return { page: 1 };
        }
    },

    onChange: function(props, page){

        this.setState(this.getState(props, page));

    },

    handleClick: function(app){
        if (app.uuid === 'new'){
            router.setRoute(`apps`);
        } else {
            router.setRoute(`/quiz/app/${app.uuid}`);
        }
    },

    handlePagination: function(page){
        this.onChange(this.props, page);
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
                if (n === 0) {
                    return undefined;
                }
                if (n === 1){
                    return n + ' Quiz';
                }
                return n + ' Quizzes';
            };
            return (
                <div className={`cq-appgrid ${this.props.className} cq-appgrid__n${this.props.appsPerPage}`}>
                    <ul>
                        {this.state.apps.map((app) => {
                            return (
                                <li className="cq-appgrid__app" key={app.uuid} onClick={this.handleClick.bind(this, app)}>
                                    <CQQuizIcon className="cq-appgrid__appicon" name={app.meta.name} image={app.meta.iconURL}/>

                                    <div className="cq-appgrid__appdetails">
                                        <div className="cq-appgrid__appname">
                                            {app.meta.name}
                                        </div>
                                        <div className="cq-appgrid__appquizzes">
                                            {howManyQuizzes(app.meta.quizzes.length)}
                                        </div>

                                        <div className="cq-appgrid__appprice">
                                            {app.uuid !== 'new' ? priceFormat(app.meta.price, '$', 'us') : ''}
                                        </div>
                                    </div>

                                </li>
                            );
                        })}
                    </ul>
                    <CQPagination
                        className="cq-appgrid__pagination"
                        onPagination={this.handlePagination}
                        pages={this.state.pages}
                        currentPage={this.state.page}/>
                </div>
            );
        }


    }

});

module.exports = CQAppGrid;
