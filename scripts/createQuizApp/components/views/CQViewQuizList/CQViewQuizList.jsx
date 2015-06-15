var React = require('react');

var CQViewQuizFilter = require('createQuizApp/components/views/CQViewQuizFilter');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');
var TopicStore = require('createQuizApp/stores/TopicStore');


var moment = require('moment');

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
        var initialState = {
            selectedQuizzes: [],
            search: {
                string: '',
            },
            quizzes: this.getQuizzesState()
        };

        return initialState;
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
    },

    getQuizzesState: function(){
        var quizzes = this.props.quizzes.map(quiz => {
            quiz._category = TopicStore.getTopicById(quiz.meta.categoryId);
            return quiz;
        });
        return quizzes;
    },

    onChange: function(){
        var quizzes = this.getQuizzesState();
        console.log('new quizzes loaded', quizzes);
        this.setState({quizzes});
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

    handleChange: function(quiz){
        var selectedQuizzes = this.state.selectedQuizzes.slice();
        var isSelected = selectedQuizzes.indexOf(quiz.uuid) === -1;


        if (isSelected === true){
            selectedQuizzes.push(quiz.uuid);
        } else {
            selectedQuizzes.splice(selectedQuizzes.indexOf(quiz.uuid), 1);
        }
        this.setState({selectedQuizzes});
        this.props.onSelect(selectedQuizzes);
    },

    handleSearch: function(string){
        console.log('searching using', string);
        var quizzes = this.getQuizzesState();
        console.log('quizzes to sort', quizzes);
        quizzes = quizzes.filter(q =>{
            if (q.meta.name) {
                return q.meta.name.toLowerCase().indexOf(string.toLowerCase()) !== -1;
            }
            return false;
        });
        this.setState({quizzes});
    },

    render: function() {

        var author;
        var select;
        var categoryName = function(quiz){
            if (quiz.meta.category){
                return (<span className="cq-viewquizlist__quizcategory">{quiz.meta.category}</span>);
            }
            return undefined;
        };

        var childActionHandler = function(child, quiz){
            if (child) {
                var clonedChildren = React.cloneElement(child, {
                    onClick: function(){
                        console.log('copy clicked', child, quiz);
                        if (child.props.onClick){
                            child.props.onClick(quiz);
                        }
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
        var categoryNameLabel = c => c ? c.name : '';

        return (
            <div>
                <CQViewQuizFilter
                    onSearchInput={this.handleSearch}/>
                <ul className={`cq-viewquizlist ${this.props.className}`}>
                    {this.state.quizzes.map((quiz, key) => {
                        return (
                            <li className="cq-viewquizlist__quiz" key={key} onClick={this.handleClick.bind(this, quiz)}>

                                {select(quiz)}

                                <CQQuizIcon className="cq-viewquizlist__quizicon" name={quiz.meta.name} image={quiz.meta.imageUrl}>
                                    <i className="zz-ic_quizalize"/>
                                </CQQuizIcon>


                                <div className="cq-viewquizlist__quiz-inner">
                                    <div className="cq-viewquizlist__quizname">{quiz.meta.name}</div><br/>
                                    {quiz.meta.subject}
                                    {author}

                                    <div className="cq-viewquizlist__quizextra">
                                        {categoryNameLabel(quiz._category)}
                                        <br/>
                                        Updated on {moment(quiz.meta.updated).fromNow()}
                                    </div>
                                </div>

                                <div className="cq-viewquizlist__extras">

                                    {childActionHandler(this.props.children, quiz, key)}
                                </div>

                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }

});

module.exports = CQViewQuizList;
