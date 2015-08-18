/* @flow */
var React = require('react');

import TopicStore from './../../stores/TopicStore';
var TopicActions = require('./../../actions/TopicActions');


type Props = {
    id: string;
    limit: number;
    value: string;
    className: string;
    tabIndex: number;
    placeholder: string;
    ref1: string;
    data: any;
    onChange: Function;
    onKeyDown: Function;
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
    props: Props;

    constructor(props:Props) {
        super(props);
        this.state = this.getState();

        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.selectOption = this.selectOption.bind(this);
    }

    componentDidMount() {
        //console.trace('CQAutofill componentDidMount');
        TopicStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        //console.trace('CQAutofill componentWillUnmount');
        TopicStore.removeChangeListener(this.onChange);
    }

    getState(props:?Props):State{
        //console.trace('CQAutofill getState');
        props = props || this.props;
        // var newState = Object.assign({}, this.state);
        var selected;

        var fillAutoFill = function(array, prefix){
            var result = [];
            array.forEach( el => {
                var name = prefix ? `${prefix} > ${el.name}` : el.name;
                result.push({
                    name: name,
                    uuid: el.uuid
                });

            });

            return result;
        };


        var topics = props.data;
        var topicsAutofill = fillAutoFill(topics);


        if (props && props.value){
            console.log('CQAutofill prop value', props.value);
            selected = TopicStore.getTopicById(props.value);
            console.log('CQAutofill prop value selected', selected);
        }
        var searchString = selected ? selected.name : undefined;

        var occurrences = this.state && this.state.occurrences ? this.state.occurrences : [];
        var selecting = this.state && this.state.selecting ? this.state.selecting : false;

        return {topics, topicsAutofill, selected, searchString, occurrences, selecting};
    }

    onChange(){
        //console.trace('CQAutofill onChange');
        this.setState(this.getState());
    }

    componentWillReceiveProps(nextProps:Props) {
        console.trace('CQAutofill componentWillReceiveProps', nextProps);
        var newState = this.getState(nextProps);
        // var topic = TopicStore.getTopicById(nextProps.value);
        // var searchString = topic ? topic.name : '';
        // var selected = topic;
        // var topics;
        // if (typeof nextProps.data === 'function'){
        //     topics = nextProps.data();
        // } else {
        //     topics = nextProps.data;
        // }

        this.setState(newState);

    }

    handleKeyDown(ev:Object){
        //console.trace('CQAutofill handleKeyDown');
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
                if (indexSelected < occurrences.length - 1){
                    indexSelected++;
                }

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
        //console.trace('CQAutofill handleRollOver', index);
        this.setState({
            indexSelected: index
        });
    }

    handleChange(ev:Object){
        //console.trace('CQAutofill handleChange', ev.target.value);
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
        //console.trace('CQAutofill selectOption');
        if (option){
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
        //console.trace('CQAutofill searchList');
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
                            onMouseOut={this.handleRollOver.bind(this, undefined)}
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
        //console.trace('CQAutofill handleFocus');
        this.handleChange(ev);
        this.setState({
            selecting: true,
            indexSelected: undefined
        });
        setTimeout(()=>{
            var domNode = React.findDOMNode(this.refs.inputField);
            domNode.select();
        }, 20);
    }

    handleAssign(){
        //console.trace('CQAutofill handleAssign');
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
        //console.trace('CQAutofill handleBlur', this);
        // this.handleAssign();
        setTimeout(()=>{
        if (this.state.selecting) {
            var option = this.state.selected;
            if (option) {
                this.selectOption(option);
            }
            // this.setState({
            //     selecting: false
            // });
        }
        }, 500);
    }

    handleClick(option:?Object){
        //console.trace('CQAutofill handleClick');
        console.log('CLICK', option);
        option = option || this.state.selected;
        if (option) {
            this.selectOption(option);
        }
    }


    onFocus(){
        //console.trace('CQAutofill onFocus');
        var element = this.refs.inputField;
        React.findDOMNode(element).focus();
        React.findDOMNode(element).select();
    }

    render(): any {
        //console.trace('CQAutofill render');
        var results = this.searchList();

        return (
            <div className='cq-autofill'>
                <input id={this.props.id}
                    type="text"
                    ref="inputField"
                    value={this.state.searchString}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder={this.props.placeholder}
                    tabIndex={this.props.tabIndex}
                    className={this.props.className}
                />

                {results}
            </div>
        );
    }

}

CQAutofill.propTypes = {
    id: React.PropTypes.string,
    tabIndex: React.PropTypes.number,
    limit: React.PropTypes.number,
    placeholder: React.PropTypes.string,
    ref1: React.PropTypes.string,
    data: React.PropTypes.func,
    value: React.PropTypes.string,
    onChange: React.PropTypes.func.isRequired,
    onKeyDown: React.PropTypes.func,
    className: React.PropTypes.string
};

CQAutofill.defaultProps = {
    limit: 30,
    onChange: function(){},
    className: 'form-control'
};
