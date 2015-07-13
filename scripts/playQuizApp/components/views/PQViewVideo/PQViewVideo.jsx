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
                console.log('youtube player', player);
                // this.setTimers();
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
                <div class="pq-viewvideo__player">

                    <div id="pq-viewvideo"/>
                </div>
                <div class="pq-viewevideo__extras">

                    Time: {displayTime(this.state.currentTime)}
                    Next questions in: {displayTime(this.state.end - this.state.currentTime)}
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
