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
    occurrences: Array<Object>;
    indexSelected?: number;
    topicsAutofill: Array<Object>;

}

export default class CQAutofill extends React.Component {

    state: State;

    constructor(props:Props) {
        super(props);
        var initialState = this.getState();

        if (this.props.value) {
            var topic = TopicStore.getTopicById(this.props.value);
        }

        initialState.searchString = topic ? topic.name : '';
        initialState.selected = initialState.selected || undefined;
        initialState.selecting = true;
        initialState.indexSelected =  undefined;

        this.state = initialState;


        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
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
                    uuid: el.uuid
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
            selected = newState.topicsAutofill.filter(t => t.uuid === this.props.value)[0];
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
        if (this.props.onKeyDown){
            this.props.onKeyDown(ev);
        }
        // up 38
        // down 40
        // enter 13

        var {indexSelected, occurrences} = this.state;
        switch (ev.keyCode) {
            case 40:
                indexSelected = indexSelected !== undefined ? indexSelected : -1;
                console.log('indexSelected', indexSelected, occurrences.length - 1);
                if (indexSelected < occurrences.length - 1){
                    indexSelected++;
                }

                console.log('indexSelected', indexSelected, occurrences.length - 1);

                this.setState({indexSelected});
                break;

            case 38:
                indexSelected = indexSelected !== undefined ? indexSelected : -1;
                if (indexSelected > 0){
                    indexSelected--;
                }
                this.setState({indexSelected});
                break;

            case 13:
                this.handleAssign();
                break;
            default:

        }
        // if (ev.keyCode === 13) {
        //     this.handleClick(this.state.selected, event);
        // }
    }

    handleRollOver(index: ?number){
        console.log('rolling over', index);
        this.setState({
            indexSelected: index
        });
    }

    handleChange(ev:Object){

        if (this.state.topicsAutofill) {

            var findOcurrences = function(data, string){
                var checkData = function(d){
                    if (!d.name){ return false; }
                    return d.name.toLowerCase().indexOf(string.toLowerCase()) !== -1;
                };

                return data.filter(checkData);
            };


            var searchString = ev.target.value;
            var searchArray = searchString.split(' ');
            var occurrences = this.state.topicsAutofill.slice();

            searchArray.forEach( s => occurrences = findOcurrences(occurrences, s) );

            occurrences = occurrences.length > this.props.limit ? occurrences.slice(0, this.props.limit) : occurrences;
            console.warn('occurrences', occurrences);

            var selected = this.getState().selected || occurrences[0];

            if (occurrences.length === 0 && searchString.length > 0) {

                var option = {
                    uuid: "-1",
                    name: searchString
                };
                TopicActions.createTemporaryTopic(option);
                occurrences = [option];

            }


            this.setState({
                selecting: true,
                indexSelected: undefined,
                searchString,
                occurrences,
                selected
            });

        }
    }

    selectOption (option:?Object){
        if (option){
            console.warn('option', option);
            this.setState({
                selected: option,
                searchString: option.name,
                selecting: false
            });
            this.props.onChange(option.uuid);
        } else {
            this.props.onChange(undefined);
        }

    }


    searchList():?Array<Object>{

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

        var list = [];
        var {occurrences, selecting, indexSelected} = this.state;

        if (occurrences && selecting){

            var getClassName = (index, className) => {
                return (indexSelected !== undefined && index === indexSelected) ? `${className}--selected` : className;
            };
            if (occurrences.length === 0) {
                var option = {
                    uuid: "-1",
                    name: this.state.searchString
                };
                list = [(
                    <li key={option.uuid}
                        className={getClassName(0, 'cq-autofill__option')}
                        onMouseOver={this.handleRollOver.bind(this, 0)}
                        onClick={this.handleClick.bind(this, option)}>
                        {this.state.searchString}
                    </li>
                )];
            } else {
                list = occurrences.map( (o, i) => {
                    return (
                        <li key={o.uuid}
                            className={getClassName(i, 'cq-autofill__option')}
                            onMouseOver={this.handleRollOver.bind(this, i)}
                            onMouseOut={this.handleRollOver.bind(this)}
                            onClick={this.handleClick.bind(this, o)}>
                            {formatString(o.name, o.uuid)}
                        </li>
                    );
                });

            }

            return (
                <ul className="cq-autofill__options">
                    {list}
                </ul>
            );
        }

    }

    handleFocus(ev:Object){
        this.handleChange(ev);
        this.setState({
            selecting: true,
            indexSelected: undefined
        });
        setTimeout(()=>{

            var domNode = React.findDOMNode(this.refs.inputField);
            console.log('selecting', domNode);
            domNode.select();
        }, 20);
    }

    handleAssign(){

        var {indexSelected, occurrences, searchString} = this.state;
        var optionSelected;

        if (indexSelected === undefined) {
            if (searchString.length !== 0){
                var option = {
                    uuid: '-1',
                    name: searchString
                };
                TopicActions.createTemporaryTopic(option);
                optionSelected = option;
            } else {
                optionSelected = undefined;
            }
        } else {
            optionSelected = occurrences[indexSelected];
        }


        this.selectOption(optionSelected);
    }

    handleBlur(){
        var option = this.state.selected;
        if (option) {
            this.selectOption(option);
        }
        this.handleAssign();
        setTimeout(()=>{
            this.setState({
                selecting: false
            });
        }, 100);
    }

    handleClick(option:?Object){
        option = option || this.state.selected;
        if (option) {
            this.selectOption(option);
        }
    }


    onFocus(){
        var element = this.refs.inputField;
        React.findDOMNode(element).focus();
        React.findDOMNode(element).select();
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
                    onKeyDown={this.handleKeyDown}
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
    onChange: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func
};

CQAutofill.defaultProps = {
    limit: 30
};
