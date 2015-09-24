/* @flow */
import React from 'react';
import moment from 'moment';

import {addYoutubeSdk} from './YoutubeApi';

type Props = {
    start: string;
    end: string;
    player: Object;
    onComplete: Function;
}



export default class PQViewVideo extends React.Component {

    constructor(props:Props){
        super(props);
        this.state = {
            currentTime: 0,
            start: this.props.start,
            end: this.props.end,
            cssState: 'enter'
        };
        this.handleYoutubeEvent = this.handleYoutubeEvent.bind(this);
        this.handleSkip = this.handleSkip.bind(this);
        this.timers = [];

        this.timers.push(setTimeout(()=>{
            this.setState({cssState: ''});
        }, 800));
    }


    componentDidMount() {
        console.log('youtubeApi', addYoutubeSdk);
        addYoutubeSdk('pq-viewvideo', 'rNu8XDBSn10', this.state.start, this.state.end, this.handleYoutubeEvent)
            .then((player)=>{
                this.player = player;
            });
    }

    componentWillUnmount() {
        this.clearTimers();
    }

    handleTime(){
        var currentTime = this.player.getCurrentTime();
        this.setState({currentTime});
    }

    handleEnd(){
        this.clearTimers();
        this.setState({cssState: 'exit'});
        setTimeout(()=>{ this.props.onComplete(); }, 600);

    }

    handleSkip(){
        this.player.stopVideo();
        this.handleEnd();
    }

    handleYoutubeEvent(ev:Object){
        // FROM: https://developers.google.com/youtube/iframe_api_reference#Events
        // -1 (unstarted)
        // 0 (ended)
        // 1 (playing)
        // 2 (paused)
        // 3 (buffering)
        // 5 (video cued).
        switch (ev.data) {
            case 0:
                this.handleEnd();
                break;
            case 1:
                this.setTimers();
                break;
            default:

        }
        console.log('we got youtube event', ev);
    }

    setTimers(){
        this.timers.push(setInterval(()=>{
            this.handleTime();
        }, 250));
    }

    clearTimers(){
        this.timers.forEach(t => clearInterval(t));
        this.timers.forEach(t => clearTimeout(t));
        this.timers = [];
    }

    render(): any {

        var displayTime = function(time){
            return moment().startOf('day')
                .seconds(time)
                .format('mm:ss');
        };

        return (
            <div className={`pq-viewvideo ${this.state.cssState}`}>
                <div className="pq-viewvideo__player">

                    <div id="pq-viewvideo"/>
                </div>
                <div className="pq-viewvideo__extras">
                    <div className="pq-viewvideo__totaltime">
                        Time: {displayTime(this.state.currentTime)}
                    </div>
                    <div className="pq-viewvideo__skip" onClick={this.handleSkip}>
                        Skip
                    </div>
                    <div className="pq-viewvideo__timeremaining">
                        Next questions in: {displayTime(this.state.end - this.state.currentTime)}
                    </div>
                </div>
            </div>
        );
    }
}

PQViewVideo.propTypes = {
    start: React.PropTypes.string.isRequired,
    end: React.PropTypes.string.isRequired,
    onComplete: React.PropTypes.func.isRequired
};
