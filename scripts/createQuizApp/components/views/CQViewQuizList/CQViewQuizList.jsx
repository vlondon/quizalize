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
        sortOptions: React.PropTypes.bool,
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
            sortOptions: false,
            onQuizClick: function(){},
            onClick: function(){},
            onSelect: function(){}
        };
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

        this.handleSearch(undefined, nextProps.quizzes);
    },



    getQuizzesState: function(){
        return this.props.quizzes;
    },

    onChange: function(){
        var quizzes = this.getQuizzesState();
        this.setState({quizzes});
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

    handleSearch: function(obj, quizzes){
        obj = obj || this.state.savedSearch;
        console.log('search/sort', obj);
        quizzes = quizzes || this.props.quizzes.slice();

        if (obj && obj.sort === 'name') {
            console.log('sorting by name');
            quizzes.sort((a, b) => a.meta.name > b.meta.name ? 1 : -1);
        } else if (obj && obj.sort === 'time') {
            console.log('sorting by date');
            quizzes.sort((a, b) => a.meta.updated > b.meta.updated ? 1 : -1);
        } else {
            quizzes.sort((a, b) => {
                if (a.meta.name === b.meta.name) {
                    return 0;
                }
                return a.meta.name > b.meta.name ? 1 : -1;
            });
            quizzes.sort((a, b) => {
                a = a._category.name.toLowerCase();
                b = b._category.name.toLowerCase();
                console.log('sorting', a, b, a > b, a === b);
                if (a === b) {
                    console.log('skipping');
                    return 0;
                }
                return a > b ? 1 : -1;
            });
            console.log('quizzes', quizzes);
            // quizzes.sort((a, b) => a._category.name > b._category.name ? 1 : -1);
        }

        // if (obj && obj.name && obj.name.length > 0){
        //     quizzes = quizzes.filter( q => {
        //         var nameMatch = false;
        //         var categoryMatch = false;
        //         nameMatch = q.meta.name.toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
        //         if (q._category) {
        //             categoryMatch = q._category.name.toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
        //         }
        //
        //         return nameMatch || categoryMatch;
        //     });
        // }

        // console.log('new Quizzes', quizzes);

        this.setState({quizzes, savedSearch: obj});
    },

    render: function() {

        var author;
        var select;
        var sort;

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

        if (this.props.sortOptions) {
            sort = (<CQViewQuizLocalSort onSearch={this.handleSearch}/>);
        }
        return (
            <div>
                {sort}
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
                                            Updated {moment(quiz.meta.updated).fromNow()}
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
