var React = require('react');

var CQViewQuizLocalSort = require('createQuizApp/components/views/CQViewQuizLocalSort');
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

    componentWillReceiveProps: function(nextProps) {
        console.info('will receive props', nextProps);
        this.setState({quizzes: nextProps.quizzes});
        this.handleSearch();
    },



    getQuizzesState: function(){
        return this.props.quizzes;
    },

    onChange: function(){
        var quizzes = this.getQuizzesState();
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

    handleSearch: function(obj){
        console.log('search/sort', obj);
        var quizzes = this.props.quizzes.slice();
        if (obj && obj.sort === 'name') {
            console.log('sorting by name');
            quizzes.sort((a, b) => a.meta.name > b.meta.name ? 1 : -1);
        } else if (obj && obj.sort === 'time') {
            console.log('sorting by date');
            quizzes.sort((a, b) => a.meta.updated > b.meta.updated ? 1 : -1);
        }

        if (obj && obj.name && obj.name.length > 0){
            quizzes = quizzes.filter( q => {
                var nameMatch = false;
                var categoryMatch = false;
                nameMatch = q.meta.name.toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
                if (q._category) {
                    categoryMatch = q._category.name.toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
                }

                return nameMatch || categoryMatch;
            });
        }

        // console.log('new Quizzes', quizzes);

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
            author = (<div className="cq-viewquizlist__quizauthor"> by <b>Quizalize Team</b></div>);
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
                <CQViewQuizLocalSort onSearch={this.handleSearch}/>
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
                                        <small>
                                            Updated on {moment(quiz.meta.updated).fromNow()}
                                        </small>
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
