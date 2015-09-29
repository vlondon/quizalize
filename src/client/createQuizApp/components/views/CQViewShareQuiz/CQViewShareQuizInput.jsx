/* @flow */
var React = require('react');

// var Timer                   = require('./content/Timer.jsx');
// var ConversationActions     = require('actions/ConversationActions');
// var Button                  = require('components/quiz/Button.jsx');

type State = {
    entries: Array<string>;
    inputEnabled: boolean;
    value: string;
    validEmails: Array<boolean>;
}

export default class CQViewShareQuizInput extends React.Component {

    state: State;

    constructor(props : Object) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.focusField = this.focusField.bind(this);
        this.addEntry = this.addEntry.bind(this);
        this.removeEntry = this.removeEntry.bind(this);
        this.submitForm = this.submitForm.bind(this);

        this.state = {
            entries: [],
            inputEnabled: true,
            value: '',
            validEmails: []
        };
    }

    componentDidMount() {

        // setTimeout(() => {
        //     this.focusField();
        // }, 700);

    }



    handleChange(ev : Object) {
        this.setState({
            value: ev.target.value
        });
        var entries = this.state.entries.slice();
        entries.push(ev.target.value);

        var validEntries = entries.filter(this.checkEmail);

        this.props.onChange(validEntries);
    }

    handleKeyDown(ev : Object) {
        // console.info(ev.keyCode);
        switch (ev.keyCode) {
            case 8: //backspace
                if (ev.target.value === ''){
                    ev.preventDefault();
                    var value = this.state.entries[this.state.entries.length - 1];
                    this.setState({ value });
                    this.removeEntry((this.state.entries.length - 1));

                }
                break;
            // case 190: // .
            case 32: //<space>
            case 188: //,
            case 13:  // intro
            case 9:   // tab
                this.addEntry(ev.target.value);
                ev.preventDefault();
                break;

        }

    }




    focusField() {
        if (this.refs.inputField){
            this.refs.inputField.getDOMNode().focus();
        }
    }

    checkEmail (string : string) : boolean {
        var checkEmailRegEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return checkEmailRegEx.test(string);
    }

    addEntry() {


        var entries = this.state.entries.concat();
        var newEntry = this.state.value.replace(/,+$/, '').trim();

        if (newEntry.length > 0){ entries.push(newEntry); }
        var validEmails = entries.map(this.checkEmail);
        var value = '';

        this.setState({ value, entries, validEmails });

    }


    removeEntry(index : number) {
        if (!this.state.inputEnabled){
            return;
        }
        var entries = this.state.entries.concat();
        entries.splice(index, 1);

        var validEmails = entries.map(this.checkEmail);
        this.setState({ entries, validEmails });
    }

    submitForm(cb : Function) {
        this.addEntry();
        cb = cb || function(){};
        this.setState({isSubmitted: true});

    }

    render() : any {
        return (
            <div className="cq-sharequiz--input">

                <ul className="list-tags" onClick={this.focusField}>
                    {
                        this.state.entries.map((entry, index) => {
                            var className = this.state.validEmails[index] ? 'list-entry valid' : 'list-entry invalid';
                            return (
                                <li className={className} key={entry}>
                                    {entry}
                                    <span className="after" onClick={this.removeEntry.bind(this, index)}>
                                        x
                                    </span>
                                </li>
                            );
                        }, this)
                    }

                    <li className="list-search">
                        { this.state.inputEnabled ? (<input type="text"
                            ref="inputField"
                            placeholder="Type email here"
                            value={this.state.value}
                            onKeyDown={this.handleKeyDown}
                            onChange={this.handleChange}
                            />) : null }
                    </li>

                    { this.state.isSubmitted ? <li className="disabled"></li> : null }
                </ul>

            </div>

        );
    }
}

CQViewShareQuizInput.propTypes = {
    cid: React.PropTypes.number.isRequired,
    question: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func
};
