/* @flow */
import React, { PropTypes } from 'react';
import CQViewQuizList from './../CQViewQuizList';
import CQQuizIcon from './../../../components/utils/CQQuizIcon';
import QuizStore from './../../../stores/QuizStore';
import CQQuizzesProfile from './../../../components/pages/CQQuizzes/CQQuizzesProfile';
import CQViewQuizPrice from './../../../components/utils/CQViewQuizPrice';
import priceFormat from './../../../utils/priceFormat';
import kolor from 'kolor';

type Props = Object;
type State = Object;

class CQViewAppQuizList extends React.Component {

    props: Props;

    constructor(props: Props) {
        super(props);

        // console.log('apps sorting', apps);
        this.getState = this.getState.bind(this);
        this.state = this.getState(props);

    }

    getState(props : Props) : State {
        props = props || this.props;

        var apps = props.apps;
        console.log('props', props);
        apps.forEach(app => {
            app.meta.quizzes.sort((a, b)=> {
                return a.meta.name.toLowerCase() > b.meta.name.toLowerCase() ? 1 : -1;
            });
        });
        if (apps.length >= 2){
            apps.sort((a, b)=>{
                console.log('sorting, ', a, b);

                // this puts "own quizzes" on top;
                if (a.uuid === 'own') { return -1; }
                if (b.uuid === 'own') { return 1; }

                return a.meta.name.toLowerCase() > b.meta.name.toLowerCase() ? 1 : -1;

            });
        }
        return {apps};
    }

    componentWillReceiveProps(nextProps : Props) {
        this.setState(this.getState(nextProps));
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

                <ul class="appquizlist__list">
                    {this.state.apps.map(app=>{
                        var quizIcon, buyApp;
                        var appColor = kolor(app.meta.colour);
                        var quizzes = [];
                        if (app.meta.quizzes) {
                            quizzes = app.meta.quizzes;
                        }
                        if (app.uuid !== 'own'){
                            quizIcon = <CQQuizIcon className="appquizlist__app__icon" name={app.meta.name} image={app.meta.iconURL}/>
                            if (this.props.own === false){

                                var buyAppLabel = app.meta.price && app.meta.price > 0 ? 'Get it for ' + priceFormat(app.meta.price, '$', 'us') : 'Save app to your profile';
                                buyApp = (
                                    <button className="appquizlist__app__button">
                                        {buyAppLabel}
                                    </button>
                                );
                            }
                        }

                        return (
                            <li className="appquizlist__app" style={{backgroundColor: appColor.fadeOut(0.7)}}>
                                <div className="appquizlist__app__infowrapper">

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
                                                {buyApp}

                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <CQViewQuizList quizzes={quizzes} className="appquizlist__list">
                                    {quizButtons}
                                </CQViewQuizList>
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
