var React = require('react');

var CQViewQuizListItem = React.createClass({
    render: function() {
        return (
            <li className={this.props.isQuizInteractive ? "cq-viewquizlist__quiz interactive" : "cq-viewquizlist__quiz" }
                key={quiz.uuid}
                onClick={this.handleClick.bind(this, quiz)}>

                {select(quiz)}

                <CQQuizIcon className="cq-viewquizlist__quizicon" name={quiz.meta.name} image={quiz.meta.imageUrl}>
                    <i className="zz-ic_quizalize"/>
                </CQQuizIcon>


                <div className="cq-viewquizlist__quiz-inner">
                    <div className="cq-viewquizlist__quizname">{quiz.meta.name}</div><br/>
                    {TopicStore.getTopicName(this.state.quiz.meta.publicCategoryId || quiz.meta.categoryId)} {author(quiz)}

                    <div className="cq-viewquizlist__quizextra">
                        <br/>
                        <small>
                            Updated {moment(quiz.meta.updated).fromNow()}
                        </small>
                    </div>
                </div>

                <div className="cq-viewquizlist__extras">
                    {reviewButton(quiz)}
                    {publishButton(quiz)}
                    {childActionHandler(this.props.children, quiz)}
                </div>
            </li>
        );
    }
});

module.exports = CQViewQuizListItem;
