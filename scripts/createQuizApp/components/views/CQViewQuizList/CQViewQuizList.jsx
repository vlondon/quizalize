var React = require('react');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQViewQuizList = React.createClass({

    propTypes: {
        quizzes: React.PropTypes.array,
        className: React.PropTypes.string,
        showAuthor: React.PropTypes.bool,
        onQuizClick: React.PropTypes.func,
        onClick: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        selectMode: React.PropTypes.bool,
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ])
    },

    getInitialState: function() {
        return {
            selectedQuizzes: []
        };
    },

    getDefaultProps: function() {
        return {
            quizzes: [],
            className: '',
            showAuthor: true,
            onQuizClick: function(){},
            onClick: function(){},
            onSelect: function(){}
        };
    },

    handleClick: function(quiz){
        if (this.props.selectMode) {
            this.handleChange(quiz);
        } else {
            this.props.onQuizClick(quiz);
        }
    },

    handleChange: function(quiz, event){
        var selectedQuizzes = this.state.selectedQuizzes.slice();
        var isSelected = selectedQuizzes.indexOf(quiz.uuid) === -1;
        console.log('some quiz selected', isSelected);


        if (isSelected === true){
            selectedQuizzes.push(quiz.uuid);
        } else {
            selectedQuizzes.splice(selectedQuizzes.indexOf(quiz.uuid), 1);
        }
        this.setState({selectedQuizzes});
        this.props.onSelect(selectedQuizzes);
    },

    render: function() {

        var author;
        var select;
        var categoryName = function(quiz){
            if (quiz.category && quiz.category.name){
                return (<span className="cq-viewquizlist__quizcategory">{quiz.category.name}</span>);
            }
            return undefined;
        };

        var childActionHandler = function(child, quiz){
            if (child) {
                var clonedChildren = React.cloneElement(child, {
                    onClick: function(){
                        console.log('copy clicked', quiz);
                        this.props.onClick(quiz);
                    }
                });
                return clonedChildren;
            }
        };

        if (this.props.showAuthor) {
            author = (<div className="cq-viewquizlist__quizauthor">by <b>Quizalize Team</b></div>);
        }

        if (this.props.selectMode) {
            select = (quiz) => {

                var isChecked = () =>  this.state.selectedQuizzes.indexOf(quiz.uuid) > -1;

                return (<input
                    onChange={this.handleChange.bind(this, quiz)}
                    checked={isChecked()}
                    type="checkbox"
                    className="cq-viewquizlist__checkbox"/>);
            };
        } else {
            select = function(){};
        }

        return (
            <ul className={`cq-viewquizlist ${this.props.className}`}>
                {this.props.quizzes.map((quiz, key) => {
                    return (
                        <li className="cq-viewquizlist__quiz" key={key} onClick={this.handleClick.bind(this, quiz)}>

                            {select(quiz)}

                            <CQQuizIcon className="cq-viewquizlist__quizicon" name={quiz.meta.name} image={quiz.settings && quiz.settings.imageUrl}>
                                <i className="zz-ic_quizalize"/>
                            </CQQuizIcon>


                            <div className="cq-viewquizlist__quiz-inner">
                                <div className="cq-viewquizlist__quizname">{quiz.name}</div><br/>
                                {author}

                                <div className="cq-viewquizlist__quizextra">
                                    {categoryName(quiz)}
                                </div>
                            </div>

                            <div className="cq-viewquizlist__extras">

                                {childActionHandler(this.props.children, quiz, key)}
                            </div>

                        </li>
                    );
                })}
            </ul>
        );
    }

});

module.exports = CQViewQuizList;
