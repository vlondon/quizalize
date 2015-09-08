/* @flow */
var React = require('react');
var QuizActions = require('./../../../actions/QuizActions');
var AppActions = require('./../../../actions/AppActions');

var CQDropdown = require('./../../../components/utils/CQDropdown');
import TopicStore from './../../../stores/TopicStore';

import type {Quiz} from './../../../stores/QuizStore';
import type {Topic} from './../../../stores/TopicStore';

type Props = {
    onSearchInput: Function;
    onViewChange: Function;
    onCategoryChange: Function;
    appEnabled: boolean;
    allTopics: boolean;
    profileId: string;
    quizzes: Array<Quiz>;
};

type State = {
    searchString: ?string;
    topics: Array<Topic>;
    categorySelected: Object;
    kindSelected: string;

};

class CQViewQuizFilter extends React.Component {

    props: Props;
    state: State;

    constructor(props : Props) {
        super(props);
        var initialState = this.getState();
        initialState.searchString = undefined;
        this.state = initialState;

        this.onChange = this.onChange.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleKind = this.handleKind.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        QuizActions.searchPublicQuizzes();
        AppActions.searchPublicApps();
        TopicStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        TopicStore.removeChangeListener(this.onChange);
    }

    onChange(){
        this.setState(this.getState());
    }

    getState() : State {
        var topics = TopicStore.getPublicSubjects();
        return {
            topics,
            searchString: '',
            categorySelected: {value: 'all'},
            kindSelected: 'all'
        };
    }

    handleSearch(ev : Object){
        var searchString = ev.target.value;
        this.props.onSearchInput(searchString);
        this.setState({
            searchString
        }, this.performSearch);

    }

    handleChange(category : Object ) {

        this.setState({
            categorySelected: category
        }, this.performSearch);
        this.props.onCategoryChange(category);

    }

    handleKind(kind : Object){
        this.setState({
            kindSelected: kind
        });

        this.props.onViewChange(kind.value);
    }

    performSearch(){

        var category = this.state.categorySelected.value === 'all' ? undefined : this.state.categorySelected.value;
        console.log('searchign for', this.state.searchString, category, this.props.profileId);
        QuizActions.searchPublicQuizzes(this.state.searchString, category, this.props.profileId);
        AppActions.searchPublicApps(this.state.searchString, category, this.props.profileId);

    }

    render() : any {

        var mappedTopics = [];
        if (this.props.allTopics) {
            if (this.state.topics.length > 0) {
                mappedTopics = this.state.topics.map(topic => {
                    return { value: topic.uuid, name: topic.name };
                });
            }
        }
        else {

            if (this.state.topics.length > 0) {
                var currentTopics : Array<Object> = this.props.quizzes.map(quiz => {
                    return { topicId: quiz.meta.categoryId };
                });
                var currentTopicsHash = {};
                currentTopics.forEach(topic => {
                    currentTopicsHash[topic.topicId] = "A";
                });

                mappedTopics = this.state.topics.map(topic => {
                    return { value: topic.uuid, name: topic.name };
                });
                mappedTopics = mappedTopics.filter(topic => {
                    return currentTopicsHash[topic.value];
                });
            }
        }

        // var quizzesAndTopics = [];
        // if (this.props.appEnabled=="true") {
        //     quizzesAndTopics = [{
        //         name: 'quizzes and apps',
        //         value: 'all'
        //     }, {
        //         name: 'quizzes',
        //         value: 'quizzes'
        //     }, {
        //         name: 'apps',
        //         value: 'apps'
        //     }];
        // }
        // else {
        //     quizzesAndTopics = [{
        //         name: 'quizzes',
        //         value: 'quizzes'
        //     }];
        // }

        var quizzesAndTopics = [{
                name: 'quizzes and apps',
                value: 'all'
            }, {
                name: 'quizzes',
                value: 'quizzes'
            }, {
                name: 'apps',
                value: 'apps'
            }];


        var quizDropDown = () => {
            if (!this.props.appEnabled)
            {
                return (
                    <span>Show classroom quizzes for any age</span>
                );
            }
            else {
                return (
                    <span>Show classroom&nbsp;
                        <CQDropdown
                            selected={this.state.kindSelected}
                            values={quizzesAndTopics}
                            onChange={this.handleKind}/>&nbsp;for any age
                    </span>
                );
            }
        };

        mappedTopics.unshift({value: 'all', name: 'any subject'});
        var topicsDropDown = () => {
            if (mappedTopics.length > 1)
            {
                return (
                    <CQDropdown
                        selected={this.state.categorySelected.value}
                        values={mappedTopics}
                        onChange={this.handleChange}/>
                );
            }
        };

        return (
            <div className='cq-quizfilter'>


                <div className="cq-quizfilter__context">

                    <div className="cq-quizfilter__search form-inline">
                        <div className="form-group">
                            <div className="input-group">

                                <span className="input-group-addon">
                                    <i className="fa fa-search"></i>
                                </span>
                                <input type="text" className="form-control"
                                    id="marketplaceSearch"
                                    onChange={this.handleSearch}
                                    value={this.state.searchString}/>
                            </div>
                        </div>
                    </div>

                    {quizDropDown()}
                    {topicsDropDown()}

                </div>


            </div>
        );
    }

}


CQViewQuizFilter.propTypes = {
    onSearchInput: React.PropTypes.func,
    onViewChange: React.PropTypes.func,
    onCategoryChange: React.PropTypes.func,
    appEnabled: React.PropTypes.bool,
    allTopics: React.PropTypes.bool,
    profileId: React.PropTypes.string,
    quizzes: React.PropTypes.array
};
module.exports = CQViewQuizFilter;
