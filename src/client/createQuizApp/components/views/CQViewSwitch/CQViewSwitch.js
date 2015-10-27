/* @flow */
import React, { PropTypes } from 'react';

class CQViewSwitch extends React.Component {

    static propTypes = {
        checked: PropTypes.bool,
        onChange: PropTypes.func
    };

    render () : any {
        const isChecked = this.props.checked;
        console.log('isChecked', isChecked);
        return (
            <label className="switch">
                <input type="checkbox"  className="switch-input"
                    checked={this.props.checked}
                    onChange={this.props.onChange}
                    />
                <span className="switch-label" data-on="Yes" data-off="No"></span>
                <span  id="switchMathMode" className="switch-handle"></span>
            </label>
        );
    }
}

export default CQViewSwitch;
