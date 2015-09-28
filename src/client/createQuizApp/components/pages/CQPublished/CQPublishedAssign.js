import React from 'react';
import CQPublished from './CQPublished';

class CQPublishedAssign extends React.Component {
    render () {
        return (
            <CQPublished {...this.props} assign={true}/>
        );
    }
}

export default CQPublishedAssign;
