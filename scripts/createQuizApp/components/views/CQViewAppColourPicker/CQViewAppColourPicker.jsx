var React = require('react');

var CQViewAppColourPicker = React.createClass({

    propTypes: {
        onChange: React.PropTypes.func
    },

    getInitialState: function() {
        var initialState = {
            selected: '#a204c3',
            availableColours: [
                '#a204c3',
                '#e3287a',
                '#d01d1b',
                '#fe7c67',
                '#c356fc',
                '#5ab49e',
                '#e2097a',
                '#1d9dd8',
                '#104c99'
            ]
        };
        this.props.onChange({
            target: {
                value: initialState.selected
            }
        });

        return initialState;
    },

    handleClick: function(colour, event){
        this.setState({selected: colour});
        event.target.value = colour;
        this.props.onChange(event);
    },

    render: function() {
        var colourBox = (colour) => {
            var style = {
                backgroundColor: colour
            };
            var selected = this.state.selected === colour;
            return (
                <div
                    onClick={this.handleClick.bind(this, colour)}
                    className={selected ? 'cq-colourpicker__colour selected' : 'cq-colourpicker__colour'}
                    style={style}/>
            );
        };
        return (
            <div className='cq-colourpicker'>
                {this.state.availableColours.map(colour=>{
                    return colourBox(colour);
                })}
            </div>
        );
    }

});

module.exports = CQViewAppColourPicker;
