import React, { PropTypes } from 'react';
import CQConversationQuestion from './../CQConversationQuestion';

class CQConversationBubble extends React.Component {

    static propTypes = {
        entry: PropTypes.object
    };

    render () {
        const {entry} = this.props;
        console.log('entry', entry);
        return (
            <div>
                <div className="bubble-container open ">
                    <div className="youniverse">

                        <div className="avatar"></div>
                        <div className="bubble">
                            <div className="inner">

                                <div className="content">
                                    {entry.value}
                                </div>

                            </div>
                            <div className="extra"/>
                        </div>

                        <div className="clearfix"/>
                    </div>
                </div>
                <CQConversationQuestion question={entry.question} onAnswer={this.props.onAnswer}/>

            </div>
        );
    }
}

export default CQConversationBubble;
