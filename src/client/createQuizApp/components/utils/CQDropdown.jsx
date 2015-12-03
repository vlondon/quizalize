var React = require('react');

var CQDropdown = React.createClass({

    propTypes: {
        values: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        selected: React.PropTypes.string
    },

    getInitialState: function() {
        return {
            selected: this.props.selected
        };
    },

    componentWillReceiveProps: function(nextProps) {
        this.setState({selected: nextProps.selected});
    },

    handleChange: function(ev){
        var fullObject = this.props.values.filter(v=> v.value === ev.currentTarget.value)[0];
        this.props.onChange(fullObject);
        this.setState({selected: ev.currentTarget.value});
    },

    render: function() {
        var getNameFormId = (id) => {

            if (this.props.values && id) {
                var values = this.props.values.filter(v=> v.value === id);
                if (values.length > 0){
                    return values[0].name;
                }
            }
            return '';
        };
        return (
            <span className="cq-quizfilter__dropdown react-textselect">
                <label htmlFor="dropdown">{getNameFormId(this.state.selected)}</label>
                <select id="dropdown" className="react-textselect-input" onChange={this.handleChange} value={this.state.selected}>
                    {this.props.values.map(val=>{
                        return val.disabled?
                        (
                            <option value={val.value} key={val.value} disabled>{val.name}</option>
                        ):
                        (
                            <option value={val.value} key={val.value}>{val.name}</option>
                        );
                    })}
                </select>
            </span>
        );
    }

});

module.exports = CQDropdown;
