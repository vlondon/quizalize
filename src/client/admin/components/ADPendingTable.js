import React, { PropTypes } from 'react';
import ADPendingQuiz from './ADPendingQuiz';

class ADPendingTable extends React.Component {

    constructor(props){

        super(props);
        let quizzes = this.props.quizzes.slice();
        let updated = [];
        let subjects = this.props.subjects.slice();
        console.log("subjects", subjects);
        quizzes.sort((x, y)=>{
            if (!x.updated) {
                return -1;
            }
            if (!y.updated) {
                return 1;
            }
            return y.updated - x.updated;
        });

        this.onChange = this.onChange.bind(this);

        this.state = { quizzes, updated, subjects };

    }

    onChange(quizChanged){
        let updated;
        let quizzes = this.state.quizzes.slice();
        let isAdded = this.state.updated.filter((updated)=>{
            return updated.uuid === quizChanged.uuid;
        })[0];


        let oldQuiz = quizzes.filter(q => q.uuid === quizChanged.uuid)[0];
        let quizIndex = quizzes.indexOf(oldQuiz);
        quizzes[quizIndex] = quizChanged;
        console.log('quizIndex', quizIndex, oldQuiz, quizChanged);

        if (!isAdded) {
            updated = this.state.updated;
            updated.push(quizChanged);
            this.setState({updated, quizzes});
            console.log("Updated", updated);
        } else {
            this.setState({quizzes});
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
                            <th>Payload</th>
                        </tr>
                    </thead>
                    <tbody>

                        {this.state.quizzes.map((quiz)=>{
                            return (
                                <ADPendingQuiz
                                    key={quiz.uuid}
                                    quiz={quiz}
                                    onChange={this.onChange}
                                    subjects={this.state.subjects}
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
