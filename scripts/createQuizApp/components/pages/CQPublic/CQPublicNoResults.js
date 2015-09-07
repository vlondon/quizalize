/* @flow */
import React from 'react';

import AnalyticsActions from './../../../actions/AnalyticsActions';
import debounce from './../../../utils/debounce';

type Props = {
    keyword: string;
}
type State = {
    keyword: string;
}

var mounted = false;
var sendEvent = debounce((keyword)=>{
    if (mounted){

        AnalyticsActions.sendEvent('marketplace_search', 'no_content', keyword);
    }
}, 600);

class CQPublicNoResults extends React.Component {
    props: Props;
    state: State;

    constructor(props : Props){
        super(props);
        this.state = {
            keyword: props.keyword
        };
        this.triggerEvent();
    }
    componentDidMount() {
        mounted = true;
    }

    componentWillUnmount() {
        mounted = false;
    }

    componentWillReceiveProps(nextProps : Props) {
        var keyword = nextProps.keyword;
        this.setState({keyword}, ()=> this.triggerEvent());

    }

    triggerEvent(){
        console.log('sending event', this.state.keyword);
        sendEvent(this.state.keyword);
    }

    render (): any {
        return (
            <div className="cq-public__noresult">
                <h1>
                    We couldn't find any content
                </h1>
                <p>You can create it yourself</p>
                <p>Talk to us!</p>
                <p>Search something else</p>
            </div>
        );

    }
}
CQPublicNoResults.propTypes = {
    keyword: React.PropTypes.string
};
export default CQPublicNoResults;
