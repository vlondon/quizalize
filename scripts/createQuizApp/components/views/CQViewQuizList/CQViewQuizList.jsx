var React = require('react');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var CQViewQuizList = React.createClass({

    propTypes: {
        quizzes: React.PropTypes.array,
        className: React.PropTypes.string,
        showAuthor: React.PropTypes.bool,
        onQuizClick: React.PropTypes.func,
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ])
    },

    getDefaultProps: function() {
        return {
            quizzes: [],
            className: '',
            showAuthor: true,
            onQuizClick: function(){}
        };
    },

    handleClick: function(quiz){
        this.props.onQuizClick(quiz);
    },

    render: function() {
        var author;



        var categoryName = function(quiz){
            if (quiz.category && quiz.category.name){
                return (<span className="cq-viewquizlist__quizcategory">{quiz.category.name}</span>);
            }
            return undefined;
        };

        var childActionHandler = function(child, quiz){
            var clonedChildren = React.cloneElement(child, {
                onClick: function(){
                    console.log('copy clicked', quiz);
                    this.props.onClick(quiz);
                }
            });
            return clonedChildren;
        };

        if (this.props.showAuthor) {
            author = (<div className="cq-viewquizlist__quizauthor">by <b>Quizalize Team</b></div>);
        }

        return (
            <ul className={`cq-viewquizlist ${this.props.className}`}>
                {this.props.quizzes.map((quiz, key) => {
                    return (
                        <li className="cq-viewquizlist__quiz" key={key} onClick={this.handleClick.bind(this, quiz)}>


                            <CQQuizIcon className="cq-viewquizlist__quizicon" name={quiz.name} image={quiz.settings && quiz.settings.imageUrl}>
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
