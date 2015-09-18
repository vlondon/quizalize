import React from 'react';


class CQPublicHeader extends React.Component {
    handleClick () {

        if (window.Intercom){
            window.Intercom('showNewMessage');
        }

    }
    render () : any {
        return (
            <div className="cq-public__headercta">
                <h1>Classroom quizzes made for teachers, <b>by teachers</b></h1>

            </div>
        );
    }
}

export default CQPublicHeader;
