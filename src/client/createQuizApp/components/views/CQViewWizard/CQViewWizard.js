import React, { PropTypes } from "react";

class CQViewWizard extends React.Component {

    static propTypes = {
        step: PropTypes.number,
        fields: PropTypes.array
    };

    static defaultProps = {
        step: 1,
        fields: [
            "Which topic?",
            "Which class?",
            "That's it!"
        ]
    };

    render () {

        let {step, fields} = this.props;


        return (
            <div className="cq-viewwizard">
                <ul>

                {fields.map((entry, index) => {
                    let currentIndex = index + 1;
                    let className = `cq-viewwizard__step${step}__entry${currentIndex}`;
                    // let isSelected = currentIndex <= selected ? "cq-viewwizard__selected" : "";
                    return (
                        <li key={index} className={`${className}`}>
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
