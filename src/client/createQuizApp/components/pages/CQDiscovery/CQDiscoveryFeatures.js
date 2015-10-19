import React from 'react';

class CQDiscoveryFeatures extends React.Component {
    render () {
        return (
            <div className="cq-discovery__features">
                <h1 className="cq-discovery__features__header">With Quizalize Premium, you can:</h1>
                <ul className="cq-discovery__features__list">
                    <li>
                        <div className="cq-discovery__features__list__icon">
                            <img src={require('./../../../../assets/cq-discovery__unlimited.svg')} alt=""/>
                        </div>
                        <h3>Create and use an unlimited number of quizzes</h3>
                        <p>and keep them private or publish them.</p>
                    </li>
                    <li>
                        <div className="cq-discovery__features__list__icon">
                            <img src={require('./../../../../assets/cq-discovery__user.svg')} alt=""/>
                        </div>
                        <h3>Use Quizalize with every class you teach</h3>
                        <p>saving hours of planning and marking.</p>
                    </li>
                    <li>
                        <div className="cq-discovery__features__list__icon">
                            <img src={require('./../../../../assets/cq-discovery__graph.svg')} alt=""/>
                        </div>
                        <h3>Access  our advanced data analysis tools</h3>
                        <p>
                            Detailed results for all past quizzes, enabling
                            you to track students’ progress over time.
                        </p>
                    </li>
                </ul>
            </div>
        );
    }
}

export default CQDiscoveryFeatures;
