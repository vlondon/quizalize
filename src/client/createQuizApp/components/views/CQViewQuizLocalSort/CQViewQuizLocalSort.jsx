var React = require('react');
var TopicStore = require('./../../../stores/TopicStore');


var CQViewQuizLocalSort = React.createClass({

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
        var topics = TopicStore.getTopicTree();
        return {
            topics,
            sort: 'time',
            categorySelected: 'all'
        };
    },

    handleSearch: function(ev){

        this.setState({
            searchString: ev.target.value
        }, this.performSearch);

    },

    handleChange: function(ev){

        this.setState({
            sort: ev.target.value
        }, this.performSearch);

    },

    performSearch: function(){
        this.props.onSearch({
            sort: this.state.sort,
            name: this.state.searchString
        });
    },

    render: function() {
        return (
            <div className='cq-quizlocalfilter'>
                <div className=''>
                    Sort by
                    <select value={this.state.sort} onChange={this.handleChange}>
                        <option value='time'>Time</option>
                        <option value='name'>Name</option>
                    </select>
                </div>
                <div className=''>
                    Search by name:
                    <input type="text" value={this.state.searchString}
                        onChange={this.handleSearch}/>
                </div>

            </div>
        );
    }

});

module.exports = CQViewQuizLocalSort;
