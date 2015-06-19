var React = require('react');

var CQViewQuizLocalSort = require('createQuizApp/components/views/CQViewQuizLocalSort');
var CQViewQuizAuthor = require('createQuizApp/components/views/CQViewQuizAuthor');
var CQPagination = require('createQuizApp/components/utils/CQPagination');
var CQQuizIcon = require('createQuizApp/components/utils/CQQuizIcon');


var TopicStore = require('createQuizApp/stores/TopicStore');

var moment = require('moment');

var CQViewQuizList = React.createClass({

    propTypes: {
        isQuizInteractive: React.PropTypes.bool,
        isPaginated: React.PropTypes.bool,
        quizzesPerPage: React.PropTypes.number,
        quizzes: React.PropTypes.array,
        className: React.PropTypes.string,
        showAuthor: React.PropTypes.bool,
        onQuizClick: React.PropTypes.func,
        onClick: React.PropTypes.func,
        onSelect: React.PropTypes.func,
        selectMode: React.PropTypes.bool,
        profileMode: React.PropTypes.bool,
        sortOptions: React.PropTypes.bool,
        sortBy: React.PropTypes.string,
        children: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.element,
            React.PropTypes.arrayOf(React.PropTypes.element)
        ])
    },

    getDefaultProps: function() {
        return {
            isQuizInteractive: false,
            isPaginated: false,
            quizzes: [],
            className: '',
            quizzesPerPage: 16,
            showAuthor: true,
            sortOptions: false,
            onQuizClick: function(){},
            onClick: function(){},
            onSelect: function(){}
        };
    },

    getInitialState: function() {

        var initialState = this.getState(undefined, 1);
        initialState.selectedQuizzes = [];
        initialState.page = 1;


        return initialState;
    },

    componentDidMount: function() {
        TopicStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        TopicStore.removeChangeListener(this.onChange);
    },

    componentWillReceiveProps: function(nextProps) {
        this.onChange(nextProps);
    },

    getState: function(props, page){
        props = props || this.props;
        var quizzes = props.quizzes;
        if (quizzes) {

            if (this.props.isPaginated) {

                quizzes = this.sort(undefined, quizzes);

                page = page || this.state.page;

                var quizzesIndexStart = (page - 1) * props.quizzesPerPage;
                console.log('page', quizzesIndexStart, page, 'props.quizzesPerPage', quizzesIndexEnd);


                var quizzesIndexEnd = quizzesIndexStart + props.quizzesPerPage;
                var quizzesToDisplay = quizzes.slice(quizzesIndexStart, quizzesIndexEnd);
                var pages = Math.ceil(quizzes.length / props.quizzesPerPage);
                console.log('quizzess', quizzes, pages, quizzesIndexStart, quizzesIndexEnd, quizzesToDisplay);
                return {
                    quizzes: quizzesToDisplay,
                    pages,
                    page
                };
            } else {
                return {quizzes};
            }
        }
    },

    onChange: function(props, page){
        this.setState(this.getState(props, page));
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

    handlePagination: function(page){
        this.onChange(this.props, page);
    },

    sort: function(obj, quizzes){

        if (this.props.sortBy && obj === undefined){
            obj = {
                sort: this.props.sortBy
            };
        }

        // obj = obj || this.state.savedSearch || undefined;

        quizzes = quizzes || this.props.quizzes.slice();

        if (obj && obj.sort === 'name') {
            quizzes.sort((a, b) => a.meta.name > b.meta.name ? 1 : -1);
        } else if (obj && obj.sort === 'time') {
            quizzes.sort((a, b) => a.meta.updated > b.meta.updated ? -1 : 1);
        } else {
            quizzes.sort((a, b) => {
                if (a._category && a._category.name && b._category &&  b._category.name){
                    var A = a._category.name.toLowerCase();
                    var B = b._category.name.toLowerCase();

                    if (A === B) {
                        return a.meta.name > b.meta.name ? 1 : -1;
                    }

                    return A > B ? 1 : -1;
                } else {
                    return a.meta.name > b.meta.name ? 1 : -1;
                }
                return 0;
            });
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

        return quizzes;
    },

    handleSearch: function(obj, quizzes){

        quizzes = this.sort(obj, quizzes);
        this.setState({quizzes, savedSearch: obj});
    },



    render: function() {
        var author = function(){};
        var select;
        var sort;

        var childActionHandler = function(child, quiz){
            if (child && child.length && child.length > 0) {
                return child.map(function(c) {

                    var clonedChildren = React.cloneElement(c, {
                        onClick: function(ev){
                            ev.preventDefault();
                            ev.stopPropagation();
                            if (c.props.onClick){
                                c.props.onClick(quiz);
                            }
                        }
                    });
                    return clonedChildren;
                });
            }
            return child;
        };


        if (this.props.showAuthor) {
            author = function(quiz){
                if (quiz.extra && quiz.extra.author) {
                    return (<CQViewQuizAuthor author={quiz.extra.author}/>);
                }
            };
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
            <div className={`cq-viewquizlist ${this.props.className}`}>
                {sort}
                <ul>
                    {this.state.quizzes.map((quiz) => {
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
                                    {quiz.meta.subject} {author(quiz)}


                                    <div className="cq-viewquizlist__quizextra">
                                        {categoryNameLabel(quiz._category)}
                                        <br/>
                                        <small>
                                            Updated {moment(quiz.meta.updated).fromNow()}
                                        </small>
                                    </div>
                                </div>

                                <div className="cq-viewquizlist__extras">
                                    {childActionHandler(this.props.children, quiz)}
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <CQPagination
                    className="cq-viewquizlist__pagination"
                    onPagination={this.handlePagination}
                    pages={this.state.pages}
                    currentPage={this.state.page}/>
            </div>
        );
    }

});

module.exports = CQViewQuizList;
