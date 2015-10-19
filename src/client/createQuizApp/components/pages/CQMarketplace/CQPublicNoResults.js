/* @flow */
import React from 'react';

import { AnalyticsActions } from './../../../actions';
import { debounce } from './../../../utils';
import { CQLink } from './../../../components';

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
        AnalyticsActions.sendIntercomEvent('marketplace_search_no_result', {keyword: keyword});
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

    handleTellUs(){
        console.log('handleTellUs');
        window.Intercom('showNewMessage');
    }

    handleSearchAgain(){
        document.getElementById('marketplaceSearch').focus();
    }

    render (): any {
        return (
            <div className="cq-public__noresult">
                <h1>
                    You’re the first!
                </h1>
                <h3>
                    No-one has made a quiz about <span className="cq-public__noresult__keyword">{this.state.keyword}</span> yet,
                    so just <CQLink href="/quiz/create">click here to make one for your class</CQLink> - it’s very easy.
                    Just type your questions and play...
                </h3>
                <p>
                    We’ll gladly help  - <CQLink href="#" onClick={this.handleTellUs}>tell us</CQLink> what you need

                </p>
                <p>
                    or just try a <CQLink href="#" onClick={this.handleSearchAgain}>different search</CQLink>
                </p>

            </div>
        );

    }
}
CQPublicNoResults.propTypes = {
    keyword: React.PropTypes.string
};
export default CQPublicNoResults;
