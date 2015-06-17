var React = require('react');
var TopicStore = require('createQuizApp/stores/TopicStore');
var QuizActions = require('createQuizApp/actions/QuizActions');
var AppActions = require('createQuizApp/actions/AppActions');

var CQDropdown = require('createQuizApp/components/utils/CQDropdown');

var CQviewQuizFilter = React.createClass({

    propTypes: {
        onSearchInput: React.PropTypes.func
    },

    getInitialState: function() {
        var initialState = this.getState();
        initialState.searchString = undefined;
        return initialState;
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        this.setState(this.getState());
    },

    getState: function(){
        var topics = TopicStore.getPublicTopics();
        return {
            topics,
            searchString: '',
            categorySelected: 'all',
            kindSelected: 'all'
        };
    },

    handleSearch: function(ev){

        this.setState({
            searchString: ev.target.value
        }, this.performSearch);

    },

    handleChange: function(category){

        this.setState({
            categorySelected: category
        }, this.performSearch);

    },

    handleKind: function(kind){
        this.setState({
            kindSelected: kind
        });

        this.props.onViewChange(kind.value);
    },

    performSearch: function(){

        var category = this.state.categorySelected.value === 'all' ? undefined : this.state.categorySelected.value;
        console.log('searchign for', this.state.searchString, category);
        QuizActions.searchPublicQuizzes(this.state.searchString, category);
        AppActions.searchPublicApps(this.state.searchString, category);

    },



    render: function() {

        var mappedTopics = [];
        if (this.state.topics.length > 0) {
            mappedTopics = this.state.topics.map(topic => {
                return { value: topic.uuid, name: topic.name };
            });

        }

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
        mappedTopics.unshift({value: 'all', name: 'any topic'});
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
                                    onChange={this.handleSearch}
                                    value={this.state.searchString}/>
                            </div>
                        </div>
                    </div>

                    Show classroom&nbsp;<CQDropdown
                        selected={this.state.kindSelected}
                        values={quizzesAndTopics}
                        onChange={this.handleKind}/>&nbsp;for any age to assess&nbsp;
                    <CQDropdown
                        selected={this.state.categorySelected}
                        values={mappedTopics}
                        onChange={this.handleChange}/>


                </div>



            </div>
        );
    }

});

module.exports = CQviewQuizFilter;
