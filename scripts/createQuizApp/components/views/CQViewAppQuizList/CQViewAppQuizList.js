/* @flow */
import React, { PropTypes } from 'react';

import CQViewQuizList from './../CQViewQuizList';
import CQQuizIcon from './../../../components/utils/CQQuizIcon';
import kolor from 'kolor';

class CQViewAppQuizList extends React.Component {
    render () : any {
        return (
            <div className="appquizlist">
                <h3>
                    Apps
                </h3>
                <ul class="appquizlist__list">
                    {this.props.apps.map(app=>{
                        var appColor = kolor(app.meta.colour);
                        return (
                            <li className="appquizlist__app" style={{backgroundColor: appColor.fadeOut(0.5)}}>
                                <CQQuizIcon className="appquizlist__app__icon" name={app.meta.name} image={app.meta.iconURL}/>
                                <div className="appquizlist__left">

                                    <div className="appquizlist__app__info">
                                        <div className="appquizlist__app__info__text">
                                            <h3 className="appquizlist__app__name">
                                                {app.meta.name}
                                            </h3>
                                            <p>
                                                {app.meta.description}
                                            </p>
                                        </div>
                                    </div>

                                    <CQViewQuizList quizzes={app.meta.quizzes} classname="appquizlist__list" />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>

        );
    }
}

CQViewAppQuizList.propTypes = {
    apps: PropTypes.array
};

export default CQViewAppQuizList;
