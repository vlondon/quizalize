/* @flow */
import React, { PropTypes } from 'react';
import CQViewQuizList from './../CQViewQuizList';
import CQQuizIcon from './../../../components/utils/CQQuizIcon';
import QuizStore from './../../../stores/QuizStore';
import CQQuizzesProfile from './../../../components/pages/CQQuizzes/CQQuizzesProfile';
import CQViewQuizPrice from './../../../components/utils/CQViewQuizPrice';

import kolor from 'kolor';

type Props = Object;
class CQViewAppQuizList extends React.Component {

    props: Props;

    constructor(props: Props) {
        super(props);
        var apps = props.apps;
        apps.forEach(app => {
            app.meta.quizzes.sort((a, b)=> {
                console.log('sorting quizzes', a.meta.name, b.meta.name);
                return a.meta.name.toLowerCase() > b.meta.name.toLowerCase() ? 1 : -1;
            });
        });
        apps.sort((a, b)=>{

            // this puts "own quizzes" on top;
            if (a.uuid === 'own') { return -1; }
            if (b.uuid === 'own') { return 1; }

            return a.meta.name.toLowerCase() > b.meta.name.toLowerCase() ? 1 : -1;

        });
        // console.log('apps sorting', apps);
        console.log('test app', apps)
        this.state = { apps };

    }

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
                    {this.state.apps.map(app=>{
                        var quizIcon;
                        var appColor = kolor(app.meta.colour);
                        var quizzes = [];
                        if (app.meta.quizzes) {
                            quizzes = app.meta.quizzes;
                        }
                        if (app.uuid !== 'own'){
                            quizIcon = <CQQuizIcon className="appquizlist__app__icon" name={app.meta.name} image={app.meta.iconURL}/>
                        }

                        return (
                            <li className="appquizlist__app" style={{backgroundColor: appColor.fadeOut(0.7)}}>
                                {quizIcon}
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
