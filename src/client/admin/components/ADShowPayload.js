import React, { PropTypes } from 'react'

class ADShowPayload extends React.Component {
    constructor(props){
        super(props);
        this.handlePayload = this.handlePayload.bind(this);
        this.state = {
            open: false
        };
    }

    handlePayload(){
        this.setState({open: true});
    }
    render () {
        
        if (this.state.open) {
            var row = (<div>{this.props.quiz.payload}</div>);
        }
        return (
            <div>

                <button onClick={this.handlePayload}>
                    Show Payload
                </button>
                {row}
            </div>
        );
    }
}

export default ADShowPayload;
