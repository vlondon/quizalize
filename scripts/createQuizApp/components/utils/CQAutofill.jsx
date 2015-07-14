/* @flow */
var React = require('react');
var assign = require('object-assign');

var TopicStore = require('./../../stores/TopicStore');
var TopicActions = require('./../../actions/TopicActions');


type Props = {
    limit: number;
    value: string;
}
type State = {
    topics: Array<Object>;
    searchString: ?string;
    selected?: Object;
    selecting: boolean;
}
export default class CQAutofill extends React.Component {

    state: State;

    constructor(props:Props) {
        super(props);
        var initialState = this.getState();

        if (this.props.value) {
            var topic = TopicStore.getTopicById(this.props.value);
            initialState.searchString = topic ? topic.name : '';
        }
        else {
            initialState.searchString = initialState.searchString || '';
        }

        initialState.selected = initialState.selected || undefined;
        initialState.selecting = true;
        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.state = initialState;
    }

    componentDidMount() {
        TopicStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        TopicStore.removeChangeListener(this.onChange);
    }

    getState():State{
        var newState = assign({}, this.state);

        var fillAutoFill = function(array, prefix){
            var result = [];
            array.forEach( el => {


                var name = prefix ? `${prefix} > ${el.name}` : el.name;
                result.push({
                    name: name,
                    id: el.uuid
                });
                if (el.categories && el.categories.length > 0){
                    fillAutoFill(el.categories, name);
                }
            });

            return result;
        };
        newState.topics = this.props.data();
        newState.topicsAutofill = fillAutoFill(newState.topics);

        var selected;
        if (this.props.value){
            selected = newState.topicsAutofill.filter(t => t.id === this.props.value)[0];
        }
        newState.searchString = selected ? selected.name : undefined;
        return newState;
    }

    onChange(){
        this.setState(this.getState());
    }

    componentWillReceiveProps(nextProps:Props) {

        var topic = TopicStore.getTopicById(nextProps.value);
        var searchString = topic ? topic.name : '';

        this.setState({
            searchString
        });
    }

    handleKeyDown(ev:Object){
        console.log('ev.keyCode', ev.keyCode);
        if (ev.keyCode === 13) {
            this.handleClick(this.state.selected, event);
        }
    }

    handleChange(ev:Object){

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

            var selected = this.getState().selected;
            // if (selected.uuid === "-1") selected = null;

            this.setState({
                searchString,
                occurrences,
                selected
            });

            if (occurrences.length === 0) {
                if (searchString.length > 0) {
                    var option = {
                        id: "-1",
                        name: searchString
                    };
                    TopicActions.createTemporaryTopic(option);
                    //
                }
            }
        }
    }

    handleClick(option:?Object, event?:Object){
        console.log('handleClchandleClickhandleClickhandleClickik', option);
        option = option || this.state.selected;
        if (option) {
            this.setState({
                selected: option,
                searchString: option.name
            });
            this.props.onChange(option.id, event);
        }
        else {
            this.setState({
                selected: null,
                searchString: ""
            });
            this.props.onChange(null, event);
        }
    }

    searchList():?Array<Object>{

        if ((this.state.searchString && this.state.searchString.length < 1) || this.state.selected !== undefined) {
            return null;
        }

        if (!this.state.selecting) { return null; }

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
            if (this.state.occurrences.length === 0) {
                var option = {
                    id: "-1",
                    name: this.state.searchString
                };
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
    }

    handleFocus(ev:Object){
        this.handleChange(ev);
        this.setState({
            selected: undefined,
            selecting: true
        });

        var domNode = React.findDOMNode(ev.target);
        domNode.select();
    }

    handleBlur(ev:Object){
        this.handleChange(ev);

        // by delying changing state we prevent a cl
        setTimeout(()=>{
            this.setState({
                selecting: false
            });
        }, 200);
    }

    onFocus(){
        console.log('Trying to focus CQAutofill');
        var element = this.refs.inputField;
        React.findDOMNode(element).focus();
    }

    render(): any {
        var results = this.searchList();

        return (
            <div className='cq-autofill'>
                <input id="category"
                    type="text"
                    ref="inputField"
                    value={this.state.searchString}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    onKeyUp={this.handleKeyDown}
                    placeholder={this.props.placeholder}
                    tabIndex={this.props.tabIndex}
                    className="form-control"/>

                {results}
            </div>
        );
    }

}

CQAutofill.propTypes = {
    tabIndex: React.PropTypes.number,
    limit: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    ref1: React.PropTypes.string,
    data: React.PropTypes.func,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired
};

CQAutofill.defaultProps = {
    limit: 30
};
