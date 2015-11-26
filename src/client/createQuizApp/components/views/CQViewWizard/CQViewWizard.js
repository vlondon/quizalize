import React, { PropTypes } from "react";

class CQViewWizard extends React.Component {

    propTypes = {
        selected: PropTypes.number
    };

    defaultProps = {
        selected: 1
    };

    render () {

        let fields = [
            "Which topic?",
            "Which class?",
            "That's it!"
        ];
        let {selected} = this.props;

        return (
            <div className="cq-viewwizard">
                <ul>

                {fields.map((entry, index) => {
                    let currentIndex = index + 1;
                    let className = `cq-viewwizard__entry${currentIndex}`;
                    let isSelected = currentIndex <= selected ? "cq-viewwizard__selected" : "";
                    return (
                        <li key={index} className={`${className} ${isSelected}`}>
                            <span className={`${className}__count`}>{currentIndex} </span>
                            {entry}
                        </li>
                    );
                })}
                </ul>
            </div>
        );
    }
}

export default CQViewWizard;
