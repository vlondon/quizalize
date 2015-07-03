/* @flow */
var React = require('react');
var moment = require('moment');

var router = require('./../../../config/router');
var CQViewQuizLocalSort = require('./../../../components/views/CQViewQuizLocalSort');
var CQViewQuizAuthor = require('./../../../components/views/CQViewQuizAuthor');
var CQPagination = require('./../../../components/utils/CQPagination');
var CQQuizIcon = require('./../../../components/utils/CQQuizIcon');

var TopicStore = require('./../../../stores/TopicStore');
var UserStore = require('./../../../stores/UserStore');



var CQViewQuizList = React.createClass({

    propTypes: {
        isQuizInteractive: React.PropTypes.bool,
        isPaginated: React.PropTypes.bool,
        quizzesPerPage: React.PropTypes.number,
        quizzes: React.PropTypes.array,
        className: React.PropTypes.string,
        showAuthor: React.PropTypes.bool,
        showCta: React.PropTypes.bool,
        showReviewButton: React.PropTypes.bool,
        quizCode: React.PropTypes.string,
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
            showReviewButton: false,
            showCta: false,
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

    componentWillReceiveProps: function(nextProps:Object) {
        this.onChange(nextProps);
    },

    getState: function(props:Object, page:?number){

        props = props || this.props;

        console.log('TopicStore', TopicStore.getTopicTree().length);
        if (TopicStore.getTopicTree().length === 0){
            return {quizzes: []};
        }


        var quizCta = function(quizzes){
            var quizPlaceholder = {
                uuid: 'new',
                meta: {
                    name: 'Create your own Quiz',
                    updated: 0
                }
            };
            if (quizzes.filter(a => a.uuid === 'new').length === 0){
                quizzes.push(quizPlaceholder);
            }
            return quizzes;

        };


        var quizzes = props.quizzes;
        if (quizzes) {
            if (this.props.showCta){
                quizzes = quizCta(quizzes);
            }
            quizzes = this.sort(undefined, quizzes);
            if (this.props.isPaginated) {

                page = page || this.state.page;

                var quizzesIndexStart = (page - 1) * props.quizzesPerPage;

                var quizzesIndexEnd = quizzesIndexStart + props.quizzesPerPage;
                var quizzesToDisplay = quizzes.slice(quizzesIndexStart, quizzesIndexEnd);
                var pages = Math.ceil(quizzes.length / props.quizzesPerPage);

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

    onChange: function(props, page:?number){
        this.setState(this.getState(props, page));
    },



    handleClick: function(quiz){
        if (this.props.selectMode) {
            this.handleChange(quiz);
        } else {
            var user = UserStore.getUser();
            if (user === false){
                swal({
                    title: 'You need to be logged in',
                    text: `In order to see more about this quiz you need to log into Quizalize`,
                    type: 'info',
                    confirmButtonText: 'Log in',
                    showCancelButton: true
                }, function(isConfirm){
                    if (isConfirm){
                        router.setRoute(`/quiz/login?redirect=${window.encodeURIComponent('/quiz/public')}`);
                    }
                });
            } else {
                this.props.onQuizClick(quiz);
            }
        }
    },

    handleReview: function(quiz){
        if (quiz){
            router.setRoute(`/quiz/review/${quiz.uuid}`);
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
            quizzes.sort((a, b) =>  a.meta.updated > b.meta.updated ? -1 : 1);
        }
        else {
            quizzes.sort((a, b) => {
                if (a.meta.categoryId && b.meta.categoryId){
                    var A = TopicStore.getTopicById(a.meta.categoryId).name.toLowerCase();
                    var B = TopicStore.getTopicById(b.meta.categoryId).name.toLowerCase();

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
                var nameMatch;
                var categoryMatch = false;
                nameMatch = q.meta.name.toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
                if (q.meta.categoryId) {
                    categoryMatch = TopicStore.getTopicName(q.meta.categoryId).toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
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

    handleNewQuiz: function(){
        router.setRoute(`/quiz/create`);
    },

    render: function() {
        var author = function(){};
        var reviewButton = function(){};
        var publishButton = function(){};
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
                        },
                        quiz: quiz
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

        if (this.props.showReviewButton) {
            reviewButton = (quiz) => {
                 if (quiz.meta && quiz.meta.originalQuizId) {
                    return (
                        <button className="cq-quizzes__button--review" onClick={this.handleReview.bind(this, quiz)}><span className="fa fa-check-square-o"></span> Review</button>
                    );
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

        if (this.props.sortOptions) {
            sort = (<CQViewQuizLocalSort onSearch={this.handleSearch}/>);
        }

        console.log('thiss.state', this.state);
        return (

            <div className={`cq-viewquizlist ${this.props.className}`}>
                {sort}
                <ul>
                    {this.state.quizzes.map((quiz) => {
                        if (quiz.uuid === 'new'){
                            return (
                                <li className={this.props.isQuizInteractive ? "cq-viewquizlist__quiz interactive" : "cq-viewquizlist__quiz" }
                                    key={quiz.uuid}
                                    onClick={this.handleNewQuiz}>
                                    <div className="cq-viewquizlist__quiz-cta">
                                        <h2><i className="fa fa-plus"></i> Create your own quiz</h2>
                                    </div>

                                </li>
                            );
                        }
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
                                    {TopicStore.getTopicName(quiz.meta.categoryId)} {author(quiz)}


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
