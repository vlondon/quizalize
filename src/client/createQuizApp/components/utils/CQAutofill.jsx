
var React = require('react');

import TopicStore from './../../stores/TopicStore';

// type Props = {
//     id: string;
//     limit: number;
//     value: string;
//     className: string;
//     tabIndex: number;
//     placeholder: string;
//     ref1: string;
//     data: any;
//     onChange: Function;
//     onKeyDown: Function;
// }
//
// type State = {
//     topics: Array<Object>;
//     searchString: string;
//     selected?: Object;
//     selecting: boolean;
//     occurrences: Array<Object>;
//     indexSelected?: number;
//     topicsAutofill: Array<Object>;
// }

export default class CQAutofill extends React.Component {

    state: State;
    props: Props;

    constructor(props:Props) {
        super(props);
        // this.state = this.getState();
        var topic;
        if (props.value) {
            topic = TopicStore.getTopicById(props.identifier, props.value);

        }
        if (props.value === undefined || topic === undefined){
            topic = TopicStore.getTopicByName(props.identifier,  '');
        }
        console.log('topic', topic);
        var indexSelected = -1;
        this.state = {
            topic,
            indexSelected
        };

        this.onChange = this.onChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.findOcurrences = this.findOcurrences.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        // this.selectOption = this.selectOption.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
        this.getTopic = this.getTopic.bind(this);
    }

    componentDidMount() {
        TopicStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        TopicStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps) {
        var topic = this.getTopic(nextProps);
        this.setState({topic});
        console.log('new topic', topic);
    }

    handleFocus(){
        this.setState({active: true});
    }

    handleBlur() {
        var occurrences = this.findOcurrences();
        var {indexSelected} = this.state;
        if (indexSelected >= 0){
            var topic = occurrences[indexSelected];
        }
        this.handleAssign(topic);
        setTimeout(()=>{
            this.setState({active: false});
        }, 300);
    }

    getTopic(props){
        props = props || this.props;
        var topic;

        if (props.value) {
            topic = TopicStore.getTopicById(props.identifier, props.value);

        }
        if (props.value === undefined || topic === undefined){
            topic = TopicStore.getTopicByName(props.identifier, '');
        }

        return topic;
    }


    onChange(){
        var topic = this.getTopic();
        this.setState({topic});
    }

    handleKeyDown(ev:Object){
        //     // up 38
        //     // down 40
        //     // enter 13
        var {indexSelected} = this.state;
        var occurrences = this.findOcurrences();
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
                var topic = occurrences[indexSelected];
                this.handleAssign(topic);

                break;
            default:
        }
    }

    handleChange(ev:Object){
        var topic = TopicStore.getTopicByName(this.props.identifier, ev.target.value);
        this.handleAssign(topic);
    }

    handleRollOver(indexSelected: ?number){
        this.setState({indexSelected});
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
        var occurrences = this.findOcurrences();
        var {topic, active, indexSelected} = this.state;
        if (active && topic){

            var getClassName = (index, className) => {
                return (indexSelected !== undefined && index === indexSelected) ? `${className}--selected` : className;
            };

            if (topic.uuid === '-1'){

                list = occurrences.map( (o, i) => {
                    return (
                        <li key={o.uuid}
                            onClick={this.handleClick.bind(this, o)}
                            onMouseOver={this.handleRollOver.bind(this, i)}
                            onMouseOut={this.handleRollOver.bind(this, undefined)}
                            className={getClassName(i, 'cq-autofill__option')}>
                            {formatString(o.name, o.uuid)}
                        </li>
                    );
                });
            }

            if (topic.uuid === '-1'){
                var text = occurrences.length === 0 ? `Create a new ${this.props.identifier}` : `Pick one below or continue typing to create a new ${this.props.identifier}`;
                list.unshift((
                    <li key={topic.uuid}
                        className={getClassName('-1', 'cq-autofill__option')}>
                        <small>{text}</small>
                        {
                            //formatString(topic.name, topic.uuid)
                        }
                    </li>
                ));
            }


            return (
                <ul className="cq-autofill__options">
                    {list}
                </ul>
            );
        }

    }

    handleClick(topic:?Object){
        console.trace('CQAutofill handleClick', topic);
        this.handleAssign(topic);

    }

    handleAssign(topic){
        this.setState({indexSelected: undefined});
        console.log('topic', topic);
        if (topic){
            this.props.onChange(topic.uuid);
        }
    }



    findOcurrences(){
        var getTopics = ()=>{
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
        //
        //
            var topics = this.props.data;
            var topicsAutofill = fillAutoFill(topics);
            return topicsAutofill;
        };

        var findOcurrences = function(data, string){
            var checkData = function(d){
                if (!d.name){ return false; }
                return d.name.toLowerCase().indexOf(string.toLowerCase()) !== -1;
            };
            return data.filter(checkData);
        };

        var {topic} = this.state;

        if (topic){
            var searchArray = topic.name.split(' ');
            var occurrences = getTopics();

            searchArray.forEach( s => occurrences = findOcurrences(occurrences, s) );

            occurrences = occurrences.length > this.props.limit ? occurrences.slice(0, this.props.limit) : occurrences;
            return occurrences;
        }
    }
    render(): any {
        //console.trace('CQAutofill render');
        // var results = [];
        var results = this.searchList();

        return (
            <div className='cq-autofill'>
                <input id={this.props.id}
                    type="text"
                    ref="inputField"
                    value={this.state.topic.name}
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
    className: React.PropTypes.string,
    identifier:  React.PropTypes.string
};

CQAutofill.defaultProps = {
    limit: 30,
    onChange: function(){},
    className: 'form-control',
    identifier: 'object'
};
