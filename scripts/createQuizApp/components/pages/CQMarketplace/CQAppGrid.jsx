/* @flow */
import React from 'react';
import router from './../../../config/router';

import AppStore from './../../../stores/AppStore';
import type {App} from './../../../stores/AppStore';
import CQQuizIcon from './../../../components/utils/CQQuizIcon';
import CQSpinner from './../../../components/utils/CQSpinner';

import CQPagination from './../../../components/utils/CQPagination';

import CQLink from './../../../components/utils/CQLink';
import CQLinkToUser from './../../../components/utils/CQLinkToUser';
import priceFormat from './../../../utils/priceFormat';

type Props = {
    className: string;
    appsPerPage: number;
}

type State = {
    apps: Array<App>;
    pages?: number;
    page: number;
};

class CQAppGrid extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        var initialState = this.getState(undefined, 1);
        this.state = initialState;

        this.getState = this.getState.bind(this);
        this.onChange = this.onChange.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState(this.getState(nextProps));
    }

    componentDidMount() {
        AppStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this.onChange);
    }

    getState(props?: Props, page?: number) : State {

        var appCreate = function(apps){

            var appPlaceholder:App = {
                uuid: 'new',
                meta: {
                    name: 'Create your own App',
                    colour: '#FFFFFF',
                    created: Date.now(),
                    description: '',
                    price: 0,
                    profileId: '-1',
                    iconURL: undefined,
                    quizzes: [],
                    updated: Date.now()
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
            return {
                apps: [],
                page: 1
            };
        }
    }

    onChange(props : Props, page : number ){

        this.setState(this.getState(props, page));

    }

    handleClick(app : App){
        if (app.uuid === 'new'){
            router.setRoute(`apps`);
        } else {
            router.setRoute(`/quiz/app/${app.uuid}`);
        }
    }

    handlePagination(page : number){
        this.onChange(this.props, page);
    }

    render() : any  {

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

                            var author;
                            if (app.extra && app.extra.author) {
                                author = (
                                    <div className="cq-appgrid__author">
                                        <CQLinkToUser uuid={app.extra.author.uuid}>by {app.extra.author.name}</CQLinkToUser>
                                    </div>
                                );
                            }
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

                                        {author}

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
}


CQAppGrid.propTypes = {
    className: React.PropTypes.string,
    appsPerPage: React.PropTypes.number
};

CQAppGrid.defaultProps = {
    appsPerPage: 10,
    className: ''
};

export default CQAppGrid;
