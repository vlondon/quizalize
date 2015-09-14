/* @flow */
import React, { PropTypes } from 'react';

import CQViewQuizList from './../CQViewQuizList';
import CQQuizIcon from './../../../components/utils/CQQuizIcon';
import QuizStore from './../../../stores/QuizStore';
import CQQuizzesProfile from './../../../components/pages/CQQuizzes/CQQuizzesProfile';
import CQViewQuizPrice from './../../../components/utils/CQViewQuizPrice';

import kolor from 'kolor';

class CQViewAppQuizList extends React.Component {


    render () : any {
        var quizButtons;

        if (this.props.own) {
            quizButtons = (<CQQuizzesProfile/>);
        } else {
            quizButtons = (<CQViewQuizPrice/>);
        }
        return (
            <div className="appquizlist">
                <h3>
                    Apps
                </h3>
                <ul class="appquizlist__list">
                    {this.props.apps.map(app=>{
                        var appColor = kolor(app.meta.colour);
                        var quizzes = [];
                        if (app.meta.quizzes) {
                            quizzes = app.meta.quizzes;
                        }

                        return (
                            <li className="appquizlist__app" style={{backgroundColor: appColor.fadeOut(0.7)}}>
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

                                    <CQViewQuizList quizzes={quizzes} classname="appquizlist__list">
                                        {quizButtons}
                                    </CQViewQuizList>
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
    apps: PropTypes.array,
    own: PropTypes.bool
};

export default CQViewAppQuizList;
