import React from 'react';
import CQPageTemplate from './../../../components/CQPageTemplate';
import MeStore from './../../../stores/MeStore';
import CQLink from './../../../components/utils/CQLink';
// import CQLink from './../../../components/utils/CQLink';

// assets
import cta1 from './../../../../assets/welcome_cta1.svg';
import cta2 from './../../../../assets/welcome_cta2.svg';
import cta3 from './../../../../assets/welcome_cta3.svg';
import cta4 from './../../../../assets/welcome_cta4.svg';
import cta5 from './../../../../assets/welcome_cta5.svg';
import ctaNew from './../../../../assets/welcome_button_new.png';

class CQWelcome extends React.Component {

    constructor(props: Object){
        super(props);
        this.state = {
            user: MeStore.state
        };
    }
    render () {
        var name = this.state.user.name ? ` ${this.state.user.name}` : '';
        return (
            <CQPageTemplate className="cq-welcome">
                <img src="/cquiz/img/logo 2.png"/>
                <h1 className="cq-welcome__header">
                    Welcome{name}! What are you teaching this week?
                </h1>

                <ul className="cq-welcome__actions">
                    <li className="cq-welcome__actions__action__1">
                        <div className="cq-welcome__actions__image">
                            <img src={cta1} alt="Play"/>
                        </div>
                        Play a demo quiz
                    </li>
                    <li className="cq-welcome__actions__action__2">
                        <div className="cq-welcome__actions__image">
                            <img src={cta2} alt="Watch the video"/>
                        </div>
                        Watch the video
                    </li>
                    <li className="cq-welcome__actions__action__3">
                        <div className="cq-welcome__actions__image">
                            <img src={cta3} alt="Printable guide"/>
                        </div>
                        Printable guide
                    </li>
                    <li className="cq-welcome__actions__action__4">
                        <div className="cq-welcome__actions__image">
                            <img src={cta4} alt="Preview a dashboard"/>
                        </div>
                        Preview a dashboard
                    </li>
                </ul>

                <div className="cq-welcome__box1__border">
                    <div className="cq-welcome__box1 clearfix">
                        <h1 className="cq-welcome__box1__header">
                            Create an instant classroom quiz
                        </h1>
                        <div className="cq-welcome__box1__text">
                            Play in class or as homework
                            <div className="cq-welcome__box1__text__alt">
                                Just type in your questions and it’s ready to go
                            </div>
                        </div>


                        <CQLink href='/quiz/create' className="cq-welcome__box1__button">
                            <img src={cta5} alt="Create a quiz"/>
                            Create a quiz
                        </CQLink>

                    </div>
                </div>

                <div className="cq-welcome__box2__border">
                    <div className="cq-welcome__box2 clearfix">
                        <div className="cq-welcome__box2__header">
                            …or grab one made by another teacher
                        </div>

                        <div className="cq-welcome__box2__text">
                            See if a great quiz on your topic already exists <br/>
                            Edit the questions to suit your class
                            <div className="cq-welcome__box2__text__alt">
                                or make a new one, and help hundreds of other teachers by sharing it here!
                            </div>

                        </div>
                        <CQLink href='/quiz/marketplace' className="cq-welcome__box2__button">
                            <img src={cta5} alt="Create a quiz"/>
                            <img src={ctaNew} alt="" className="cq-welcome__box2__button__new"/>
                            Browse marketplace
                        </CQLink>
                    </div>
                </div>

            </CQPageTemplate>
        );
    }
}

export default CQWelcome;
