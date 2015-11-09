import React, { PropTypes } from 'react';

import ADCategoryPicker from './ADCategoryPicker';
import ADShowPayload from './ADShowPayload';

class ADPendingQuiz extends React.Component {
    constructor(props){

        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange (updatedQuiz) {
        this.props.onChange(updatedQuiz);
    }

    render () {

        let {quiz} = this.props;
        let questionAmount;
        if (quiz.type === 'quiz'){
            questionAmount = JSON.parse(quiz.payload).questions.length;
        }

        return (
            <tr>
                <td>
                    {quiz.type}
                </td>
                <td>
                    {quiz.meta.name} - {questionAmount}
                </td>
                <td className='categoryId'>
                    {quiz.meta.categoryId}
                </td>
                <td>
                    <a href={`https://www.quizalize.com/app#/play/public/${quiz.uuid}`}>
                        Preview
                    </a>
                </td>

                <td>
                    Editor
                </td>
                <td>
                    {window.moment(quiz.updated).format('DD-MM-YYYY')}
                </td>
                <td>
                    Subject
                    <ADCategoryPicker onChange={this.onChange} quiz={this.props.quiz} subjects={this.props.subjects}/>
                </td>
                <td>
                    <ADShowPayload quiz={this.props.quiz}/>
                </td>


            </tr>
        );
    }
}

export default ADPendingQuiz;
