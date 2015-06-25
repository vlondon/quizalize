var React = require('react');

var TopicStore = require('createQuizApp/stores/TopicStore');

var CQAutofill = React.createClass({

    propTypes: {
        tabIndex: React.PropTypes.number,
        limit: React.PropTypes.number,
        data: React.PropTypes.any
    },

    getDefaultProps: function() {
        return {
            limit: 30
        };
    },

    getInitialState: function() {
        var selectedTopic;

        return {
            searchString: selectedTopic || '',
            selected: undefined,
            topics: TopicStore.getAllTopics()
        };
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
    },

    onChange: function(){
        var newState = {};
        newState.topics = TopicStore.getAllTopics();

        newState.topicsAutofill = [];

        var fillAutoFill = function(array, prefix){
            array.forEach( el => {


                var name = prefix ? `${prefix} > ${el.name}` : el.name;
                newState.topicsAutofill.push({
                    name: name,
                    id: el.uuid
                });
                if (el.categories && el.categories.length > 0){
                    fillAutoFill(el.categories, name);
                }
            });
        };

        fillAutoFill(newState.topics);

        this.setState(newState);

    },

    componentWillReceiveProps: function(nextProps) {

        var topic = TopicStore.getTopicById(nextProps.value);
        var searchString = topic ? topic.name : '';

        this.setState({
            searchString
        });
    },

    handleChange: function(ev){

        if (this.state.topicsAutofill) {
            var searchString = ev.target.value;
            var searchArray = searchString.split(' ');

            var findOcurrences = function(data, string){
                var checkData = function(d){
                    if (!d.name){ return false; }
                    return d.name.toLowerCase().indexOf(string.toLowerCase()) !== -1;
                };

                return data.filter(d => checkData(d));
            };

            var occurrences = this.state.topicsAutofill.slice();
            searchArray.forEach( s => occurrences = findOcurrences(occurrences, s) );

            occurrences = occurrences.length > this.props.limit ? occurrences.slice(0, this.props.limit) : occurrences;

            this.setState({
                searchString,
                occurrences
            });
        }
    },

    handleClick: function(option){

        this.setState({
            selected: option,
            searchString: option.name
        });
    },

    searchList: function(){

        if (this.state.searchString.length < 1 || this.state.selected !== undefined) {
            return null;
        }

        var formatString = function(string, key){
            var format = string.split('>').map(function(s, i){
                return [
                    (<span key={`separator-${key}`}> > </span>),
                    (<span className={`result-${i}`} key={`value-${key}`}>{s.trim()}</span>)
                ];
            });

            // this gets rid of the first >
            format[0] = format[0][1];
            return format;
        };

        var list;
        if (this.state.occurrences){
            if (this.state.occurrences.length==0) {
                var option = {
                    id: -1,
                    name: this.state.searchString
                }
                list = [(
                    <li key={option.id} className="cq-autofill__option" onClick={this.handleClick.bind(this, option)}>
                        {this.state.searchString}
                    </li>
                )
                ];
                }
            else {
                list = this.state.occurrences.map( o => {
                    return (
                        <li key={o.id} className="cq-autofill__option" onClick={this.handleClick.bind(this, o)}>
                            {formatString(o.name, o.id)}
                        </li>
                    );
                });

            }
        }
        else {
            return [];
        }


        return (
            <ul className="cq-autofill__options">
                {list}
            </ul>
        );
    },

    handleFocus: function(ev){
        console.log('handleFocus');
        this.handleChange(ev);
        this.setState({
            selected: undefined
        });

        var domNode = React.findDOMNode(ev.target);
        domNode.select();
    },

    render: function() {
        var results = this.searchList();
        return (
            <div className='cq-autofill'>
                <input id="category"
                    type="text"
                    value={this.state.searchString}
                    onFocus={this.handleFocus}
                    onChange={this.handleChange}
                    placeholder="e.g. Earthquakes (Optional)"
                    tabIndex={this.props.tabIndex}
                    className="form-control"/>

                {results}
            </div>
        );
    }

});

module.exports = CQAutofill;
