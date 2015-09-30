import React from 'react';
import CQPublished from './CQPublished';

class CQPublishedShare extends React.Component {
    render () {
        return (
            <CQPublished {...this.props} share={true}/>
        );
    }
}

export default CQPublishedShare;
