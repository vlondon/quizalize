var React = require('react');
var CQQuizIcon = require('./CQQuizIcon');
var CQPublicList = React.createClass({

    propTypes: {
        quizzes: React.PropTypes.array,
        className: React.PropTypes.string
    },

    getDefaultProps: function() {
        return {
            quizzes: []
        };
    },

    render: function() {
        var categoryName = function(quiz){
            if (quiz.category && quiz.category.name){
                return (<span className="cq-public__quizcategory">{quiz.category.name}</span>);
            }
            return undefined;
        };
        return (
            <ul className={this.props.className}>
                {this.props.quizzes.map((quiz, key) => {
                    return (
                        <li className="cq-public__quiz" key={key}>


                            <CQQuizIcon className="cq-public__quizicon" name={quiz.name} image={quiz.settings.imageUrl}>
                                <i className="zz-ic_quizalize"/>
                            </CQQuizIcon>


                            <div className="cq-public__quiz-inner">
                                <div className="cq-public__quizname">{quiz.name}</div><br/>
                                <div className="cq-public__quizauthor">by <b>Quizalize Team</b></div>



                            </div>
                            <div className="cq-public__quizextra">
                                {categoryName(quiz)}
                                <span className="cq-public__quizcategory">7-11</span>
                            </div>


                        </li>
                    );
                })}
            </ul>
        );
    }

});

module.exports = CQPublicList;
