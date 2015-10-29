import React, { PropTypes } from 'react';

import ADCategoryPicker from './ADCategoryPicker';

class ADPendingQuiz extends React.Component {

    onChange () {
        this.props(this.props.quiz);
    }

    render () {

        let {quiz} = this.props;
        let questionAmmount;
        if (quiz.type === 'quiz'){
            questionAmmount = JSON.parse(quiz.payload).questions.length;
        }

        return (
            <tr>
                <td>
                    {quiz.type}
                </td>
                <td>
                    {quiz.meta.name} - {questionAmmount}
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
                    <ADCategoryPicker onChange={this.onChange}/>
                </td>

            </tr>
        );
    }
}

export default ADPendingQuiz;
