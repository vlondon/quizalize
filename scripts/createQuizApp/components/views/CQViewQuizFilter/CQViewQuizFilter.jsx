var React = require('react');
var TopicStore = require('createQuizApp/stores/TopicStore');


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
        return {topics};
    },

    handleSearch: function(ev){
        this.props.onSearchInput(ev.target.value);
    },

    render: function() {
        return (
            <div className='cq-quizfilter'>
                <div className='col-md-1'>
                    Filter
                </div>
                <div className='col-md-2'>
                    Search by name:
                    <input type="text" value={this.state.searchString}
                        onChange={this.handleSearch}/>
                </div>
                <div className="col-md-2">
                    <select>
                        {this.state.topics.map(topic=>{
                            return (
                                <option>{topic.name}</option>
                            )
                        })}
                    </select>

                </div>
            </div>
        );
    }

});

module.exports = CQviewQuizFilter;
