/* @flow */
import React from 'react';

type Props = {
    duration: number;
    onChange: Function;
};

class CQEditDurationPicker extends React.Component {

    constructor (props : Props){
        super(props);
        this.state = {
            selected: props.duration,
            available: [5, 10, 20, 30, 45, 60]
        };
        this.handleSelect = this.handleSelect.bind(this);
    }
    componentWillReceiveProps(nextProps : Props) {
        console.log('nextProps', nextProps);
        this.setState({selected: nextProps.duration});
    }

    handleSelect(selected : number){
        this.setState({selected});
        this.props.onChange(selected);
    }

    render () : any {
        var option = (time) => {

            var className = (time === this.state.selected) ? 'cq-duration__time--selected' : 'cq-duration__time';
            return (
                <li className={className}
                    onClick={this.handleSelect.bind(this, time)}
                    key={time}>
                    {time}s
                </li>
            );

        };
        return (
            <ul className="cq-duration">
                {this.state.available.map(option)}
            </ul>
        );
    }
}

CQEditDurationPicker.propTypes = {
    onChange: React.PropTypes.func
};
export default CQEditDurationPicker;
