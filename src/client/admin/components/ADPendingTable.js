import React, { PropTypes } from 'react';
import ADPendingQuiz from './ADPendingQuiz';

class ADPendingTable extends React.Component {

    constructor(props){

        super(props);
        let quizzes = this.props.quizzes.slice();
        let updated = [];

        quizzes.sort((x, y)=>{
            if (!x.updated) {
                return -1;
            }
            if (!y.updated) {
                return 1;
            }
            return y.updated - x.updated;
        });


        this.state = { quizzes, updated };

    }

    onChange(quizChanged){
        let isAdded = this.state.updated.filter((updated, quizChanged)=>{
            return updated.uuid === quizChanged.uuid;
        })[0];
        if (!isAdded) {
            let {updated} = this.state;
            updated.push(quizChanged);
            this.setState({updated});
        }
    }

    onSave(){
        this.state.updated.map( quiz => {
            // TODO Add logic to save the quiz that has been changed
        });
    }
    render () {
        return (
            <div className="react-admin">
                <table
                    border={1}
                    style={{backgroundColor: 'white', fontSize: 12, width: '100%'}}
                >
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>preview</th>
                            <th>Editor</th>
                            <th>Updated</th>
                            <th>
                                Set Category And Approve
                            </th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.quizzes.map((quiz)=>{
                            return (
                                <ADPendingQuiz
                                    key={quiz.uuid}
                                    quiz={quiz}
                                    onChange={this.onChange}
                                    {...this.props}
                                />
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ADPendingTable;
