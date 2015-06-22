var React = require('react');

var debounce = require('createQuizApp/utils/debounce');

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
        return {
            searchString: '',
            selected: undefined
        };
    },

    componentWillReceiveProps: function(nextProps) {
        var data = nextProps.data;
        var selectedTopic = data.filter(d=> d.id === nextProps.value)[0];
        console.log('selectedTopic', selectedTopic);

        if (selectedTopic){
            this.setState({
                searchString: selectedTopic.name
            });
        }
    },

    handleChange: function(ev){

        if (this.props.data) {
            var searchString = ev.target.value;
            var searchArray = searchString.split(' ');

            var findOcurrences = function(data, string){
                var o = data.filter(d => d.name.toLowerCase().indexOf(string.toLowerCase()) !== -1);
                return o;
            };

            var occurrences = this.props.data.slice();
            searchArray.forEach( s => occurrences = findOcurrences(occurrences, s) );
            occurrences = occurrences.length > this.props.limit ? occurrences.slice(0, this.props.limit) : occurrences;

            this.setState({
                searchString,
                occurrences
            });
        }
    },

    handleClick: function(option){
        console.log('option', option);
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

            list = this.state.occurrences.map( o => {
                return (
                    <li key={o.id} className="cq-autofill__option" onClick={this.handleClick.bind(this, o)}>
                        {formatString(o.name, o.id)}
                    </li>
                );
            });
        } else {
            list = [];
        }


        return (
            <ul className="cq-autofill__options">
                {list}
            </ul>
        );
    },

    handleFocus: function(ev){
        console.log('input focused');
        this.setState({
            selected: undefined
        });

        var domNode = React.findDOMNode(ev.target);
        domNode.select();
        console.log('adf', domNode);
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
