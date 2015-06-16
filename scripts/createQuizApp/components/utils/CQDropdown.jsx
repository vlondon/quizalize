var React = require('react');

var CQDropdown = React.createClass({

    propTypes: {
        values: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        selected: React.PropTypes.object
    },

    getInitialState: function() {
        return {
            selected: this.props.selected
        };
    },

    handleChange: function(ev){
        var fullObject = this.props.values.filter(v=> v.value === ev.currentTarget.value)[0];
        this.props.onChange(fullObject);
        this.setState({selected: ev.currentTarget.value});
    },

    render: function() {
        var getNameFormId = (id) => {
            if (this.props.values && id) {
                return this.props.values.filter(v=> v.value === id)[0].name;
            }
            return '';
        };
        return (
            <span className="cq-quizfilter__dropdown react-textselect">
                {getNameFormId(this.state.selected)}
                <select className="react-textselect-input" onChange={this.handleChange} value={this.state.selected}>
                    {this.props.values.map(val=>{
                        return (
                            <option value={val.value} key={val.value}>{val.name}</option>
                        );
                    })}
                </select>
            </span>
        );
    }

});

module.exports = CQDropdown;
