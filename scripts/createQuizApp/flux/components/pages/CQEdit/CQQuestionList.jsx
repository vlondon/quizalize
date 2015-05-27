var React = require('react');

var CQLink = require('createQuizApp/flux/components/utils/CQLink');

var CQQuestionList = React.createClass({
    propTypes: {
        questions: React.PropTypes.array.isRequired
    },

    getDefaultProps: function() {
        return {
            questions: []
        };
    },
    render: function() {
        return (
            <div className="row ql-question-list">
                <div className="col-xs-12">
                    <div className="well">
                        {this.props.questions.map((item, index) => {
                            return (
                                <div className="row" key={index}>
                                    <div className="col-sm-6">
                                        <h4>
                                            {index + 1}. {item.question}
                                        </h4>
                                    </div>
                                    <div className="col-sm-4">
                                        <h4 className="text-info">
                                            {item.answer}
                                        </h4>
                                    </div>
                                    <div className="col-sm-2">
                                        <CQLink href={`/quiz/create/${this.props.quiz.uuid}/${index}`}>

                                            <button type='button' style={{margin: '4px'}} className="btn btn-info">
                                                <span className="glyphicon glyphicon-pencil"></span>
                                            </button>
                                        </CQLink>
                                        <button type='button' className="btn btn-danger">
                                            <span className="glyphicon glyphicon-remove"></span>
                                        </button>

                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                ql
            </div>
        );
    }

});

module.exports = CQQuestionList;
