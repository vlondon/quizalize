var React = require('react');

var GroupStore  = require('createQuizApp/stores/GroupStore');


var CQViewClassList = React.createClass({
    getInitialState: function() {
        return this.getState();
    },
    componentDidMount: function() {
        GroupStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        GroupStore.removeChangeListener(this.onChange);
    },

    getState: function(){

        var groups = GroupStore.getGroups();


        return { groups };

    },

    _showGroupsList: function(){

        if (!this.state.groups) {
            return [{
                value: null,
                label: 'Loading',
                disabled: true
            }];
        }
        var groupList = this.state.groups.map(g => {
            return {value: g.code, label: g.name};
        });

        return groupList;

    },

    render: function() {
        return (
            <div>
                Set as a class game (or homework)…
                <ul className="list-unstyled">
                    {this._showGroupsList().map( (classN) => {
                        return (
                            <li key={classN.value}>
                                <input type="checkbox" id={classN.value}/>
                                <label htmlFor={classN.value}>
                                    &nbsp;{classN.label}
                                </label>

                            </li>
                        );
                    })}
                </ul>
                <input type="text" placeholder="Enter a new class name"/>
                <br/>
                <button className="btn btn-default"
                    onClick={this.handleClick}>
                    Done - Go to your dashboard
                </button>
            </div>
        );
    }

});

module.exports = CQViewClassList;
