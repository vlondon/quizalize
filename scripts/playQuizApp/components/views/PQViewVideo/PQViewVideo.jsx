/* @flow */
import React from 'react';

import {addYoutubeSdk} from './YoutubeApi';

class PQViewVideo extends React.Component {

    constructor(props:Object){
        super(props);
    }

    componentDidMount() {
        console.log('youtubeApi', addYoutubeSdk);
        addYoutubeSdk('pq-viewvideo', 'kfchvCyHmsc').then((player)=>{
            console.log('youtube player', player);
        });
    }

    render(): any {
        return (
            <div>
                <div id="pq-viewvideo"/>
                Video!
            </div>
        );
    }
}

export default PQViewVideo;
