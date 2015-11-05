import React, { PropTypes } from 'react';

class ADCategoryPicker extends React.Component {
    constructor(props){

        super(props);
        this.handleQuizChange = this.handleQuizChange.bind(this);
        this.handleSubjectChange = this.handleSubjectChange.bind(this);
        this.state = {
            selected: false,
            value: 'select'
        };
    }

    handleQuizChange(){
        var category = "aAAAAAaa";
        var subject = "asdasdihasdhasdiuhas";
        var name = 'BLABLABAL SIngle quotes';

        var updatedQuiz = JSON.parse(JSON.stringify(this.props.quiz));
        updatedQuiz.meta.publicCategoryId = category;
        updatedQuiz.meta.subjectId = subject;
        updatedQuiz.meta.name = name;
        this.props.onChange(updatedQuiz);
    }

    handleSubjectChange(event){
        this.setState({selected:true, value:event.target.value});
        console.log(event.target.value);
        console.log("value", this.state.value);
    }
    render () {
        if (this.state.selected){
            var category = (<option>It worked!</option>);
        }
        else {
            var category = (<option></option>);
        }
        return (


            <div>
            <button onClick={this.handleQuizChange}>Change me!</button>
                <select onChange={this.handleSubjectChange} value={this.state.value}>
                    <option value="A">Apple</option>
                    <option value="B">Banana</option>
                    <option value="C">Cranberry</option>
                 </select>

                <select>
                    {category}
                </select>
            </div>

        );
    }
}

export default ADCategoryPicker;
