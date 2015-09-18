/* @flow */
var React = require('react');
var moment = require('moment');

import type {Quiz} from './../../../stores/QuizStore';
import QuizSorter from './../../../stores/extra/QuizSorter';

var router = require('./../../../config/router');
var CQViewQuizLocalSort = require('./../../../components/views/CQViewQuizLocalSort');
var CQViewQuizAuthor = require('./../../../components/views/CQViewQuizAuthor');
var CQPagination = require('./../../../components/utils/CQPagination');
var CQQuizIcon = require('./../../../components/utils/CQQuizIcon');

import TopicStore from './../../../stores/TopicStore';
import UserStore from './../../../stores/UserStore';


type Props = {
    isQuizInteractive: boolean;
    isPaginated: boolean;
    quizzesPerPage: number;
    quizzes: Array<Quiz>;
    className: string;
    selectedQuizzes: Array<string>;
    showAuthor: boolean;
    showCta: boolean;
    showReviewButton: boolean;
    showBought: boolean;
    quizCode: string;
    onQuizClick: Function;
    onClick: Function;
    onSelect: Function;
    selectMode: boolean;
    profileMode: boolean;
    sortOptions: boolean;
    sortBy: string;
    children: any;
};

type State = {
    page: number;
    pages: number;
    quizzes: Array<Object>;
    selectedQuizzes: Array<string>;
};

var sorter = new QuizSorter();

export default class CQViewQuizList extends React.Component {

    props: Props;

    constructor(props:Props) {
        super(props);
        var initialState = this.getState(props, 1);
        initialState.selectedQuizzes = this.props.selectedQuizzes || [];
        initialState.page = 1;
        this.state = initialState;
        this.onChange = this.onChange.bind(this);
    }



    componentDidMount() {
        sorter = new QuizSorter();
        TopicStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        console.info("removing TopicStore listener");
        TopicStore.removeChangeListener(this.onChange);
    }

    componentWillReceiveProps(nextProps:Object) {
        this.onChange(nextProps);

    }

    getState(props:Props, page:?number): State {

        props = props || this.props;
        var state:State = Object.assign({}, this.state);


        if (TopicStore.getTopicTree().length === 0){
            state.quizzes = [];
            return state;
        }


        var quizCta = function(quizzes){
            var quizPlaceholder = {
                uuid: 'new',
                meta: {
                    name: 'Create your own Quiz',
                    updated: 0,
                    authorId: '0',
                    categoryId: '0',
                    code: '0',
                    created: 0,
                    profileId: '0',
                    random: false,
                    price: 0,
                    published: '0'
                }
            };
            if (quizzes.filter(a => a.uuid === 'new').length === 0){
                quizzes.push(quizPlaceholder);
            }
            return quizzes;

        };

        var quizzes = sorter.setQuizzes(props.quizzes);

        if (quizzes) {
            quizzes = sorter.sort('time');
            if (props.showCta){
                quizzes = quizCta(quizzes);
            }

            if (this.props.sortBy){
                quizzes = this.sort(undefined, quizzes);
            }
            // quizzes = this.sort(props, quizzes);
            if (this.props.isPaginated) {

                page = page || this.state.page;

                var quizzesIndexStart = (page - 1) * props.quizzesPerPage;

                var quizzesIndexEnd = quizzesIndexStart + props.quizzesPerPage;
                var quizzesToDisplay = quizzes.slice(quizzesIndexStart, quizzesIndexEnd);
                var pages = Math.ceil(quizzes.length / props.quizzesPerPage);


                state.quizzes = quizzesToDisplay;
                state.pages = pages;

                if (page > pages) {
                    page = 1;
                }
                state.page = page;
            } else {
                state.quizzes = quizzes;
            }
        }
        return state;
    }

    onChange(props:Props, page:?number){
        props = props || this.props;
        var newState = this.getState(props, page);
        if (props.selectedQuizzes) {
            newState.selectedQuizzes = props.selectedQuizzes;
        }
        this.setState(newState);
    }


    handleClick(quiz:Quiz){
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
                        router.setRoute(`/quiz/login?redirect=${window.encodeURIComponent('/quiz/marketplace')}`);
                    }
                });
            } else {
                this.props.onQuizClick(quiz);
            }
        }
    }

    handleReview(quiz:Quiz) {
        if (quiz){
            router.setRoute(`/quiz/review/${quiz.uuid}`);
        }
    }

    handleChange(quiz:Quiz) {
        var selectedQuizzes = this.state.selectedQuizzes.slice();
        var isSelected = selectedQuizzes.indexOf(quiz.uuid) === -1;


        if (isSelected === true){
            selectedQuizzes.push(quiz.uuid);
        } else {
            selectedQuizzes.splice(selectedQuizzes.indexOf(quiz.uuid), 1);
        }
        this.setState({selectedQuizzes});
        this.props.onSelect(selectedQuizzes);
    }

    handlePagination(page:number) {
        this.onChange(this.props, page);
    }

    sort(sortingOption:?Object, quizzes:?Array<Quiz>): Array<Quiz> {
        //
        var obj:?Object;
        if (this.props.sortBy && sortingOption === undefined){
            obj = {
                sort: this.props.sortBy
            };
        } else {
            obj = sortingOption;
        }

        // obj = obj || this.state.savedSearch || undefined;

        quizzes = quizzes || this.props.quizzes.slice();

        if (obj && obj.sort === 'name') {
            quizzes.sort((a, b) => a.meta.name > b.meta.name ? 1 : -1);
        } else if (obj && obj.sort === 'time') {
            quizzes.sort((a, b) =>  a.meta.updated > b.meta.updated ? -1 : 1);
        } else if (obj && obj.sort === 'category' ) {
            quizzes.sort((a, b) => {
                if (a.meta.categoryId && b.meta.categoryId){
                    var topicA = TopicStore.getTopicById(a.meta.categoryId);
                    var topicB = TopicStore.getTopicById(b.meta.categoryId);

                    if (topicA) {
                        var A = topicA.name && topicA.name.toLowerCase();
                    }
                    if (topicB) {
                        var B = topicB.name && topicB.name.toLowerCase();
                    }

                    if (A && B && A === B) {
                        return a.meta.name > b.meta.name ? 1 : -1;
                    }

                    return A > B ? 1 : -1;
                } else {
                    return a.meta.name > b.meta.name ? 1 : -1;
                }
            });
        }

        // if (obj && obj.name && obj.name.length > 0){
        //     quizzes = quizzes.filter( q => {
        //         var nameMatch;
        //         var categoryMatch = false;
        //         nameMatch = q.meta.name.toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
        //         if (q.meta.categoryId) {
        //             categoryMatch = TopicStore.getTopicName(q.meta.categoryId).toLowerCase().indexOf(obj.name.toLowerCase()) !== -1;
        //         }
        //
        //         return nameMatch || categoryMatch;
        //     });
        // }

        return quizzes;
    }

    handleSearch (obj:?Object, quizzes: ?Array<Quiz>) {
        quizzes = this.sort(obj, quizzes);
        this.setState({quizzes, savedSearch: obj});
    }

    handleNewQuiz(){
        router.setRoute(`/quiz/create`);
    }

    render():any {

        var author = function(){};
        var reviewButton = function(){};
        var publishButton = function(){};
        var select:Function = function(){};
        var sort;
        var updated = function(){};

        var childActionHandler = function(child, quiz){
            console.log('child????', typeof child);
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
            } else if (child) {
                var clonedChildren = React.cloneElement(child, {
                    onClick: function(ev){
                        ev.preventDefault();
                        ev.stopPropagation();
                        if (child.props.onClick){
                            child.props.onClick(quiz);
                        }
                    },
                    quiz: quiz
                });
                return clonedChildren;
            }
            return child;
        };


        if (this.props.showAuthor) {
            author = function(quiz){
                if (quiz.extra && quiz.extra.author) {
                    return (<CQViewQuizAuthor author={quiz.extra.author}/>);
                }
            };
        } else {
            updated = function(quiz){
                return `Updated ${moment(quiz.meta.updated).fromNow()}`;
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
        }

        if (this.props.sortOptions) {
            sort = (<CQViewQuizLocalSort onSearch={this.handleSearch}/>);
        }


        return (

            <div className={`${this.props.className}`}>
                {sort}
                <ul className={`cq-viewquizlist`}>
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

                                <CQQuizIcon className="cq-viewquizlist__quizicon" name={quiz.meta.name || "Untitled Quiz"} image={quiz.meta.imageUrl}>
                                    <i className="zz-ic_quizalize"/>
                                </CQQuizIcon>


                                <div className="cq-viewquizlist__quiz-inner">
                                    <span className="cq-viewquizlist__quiztopic">{TopicStore.getTopicName(quiz.meta.publicCategoryId || quiz.meta.categoryId)}</span><br/>
                                    <div className="cq-viewquizlist__quizname">{quiz.meta.name || "Untitled Quiz"}</div><br/>
                                    {author(quiz)}


                                    <div className="cq-viewquizlist__quizextra">
                                        <small>
                                            {updated(quiz)}
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
                    onPagination={this.handlePagination.bind(this)}
                    pages={this.state.pages}
                    currentPage={this.state.page}/>
            </div>
        );
    }
}

CQViewQuizList.propTypes = {
    isQuizInteractive: React.PropTypes.bool,
    isPaginated: React.PropTypes.bool,
    quizzesPerPage: React.PropTypes.number,
    quizzes: React.PropTypes.array,
    className: React.PropTypes.string,
    selectedQuizzes: React.PropTypes.array,
    showAuthor: React.PropTypes.bool,
    showCta: React.PropTypes.bool,
    showReviewButton: React.PropTypes.bool,
    showBought: React.PropTypes.bool,
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
};
CQViewQuizList.defaultProps = {
    isQuizInteractive: false,
    isPaginated: false,
    quizzes: [],
    className: '',
    quizzesPerPage: 16,
    showAuthor: true,
    showReviewButton: false,
    showBought: true,
    showCta: false,
    sortOptions: false,
    onQuizClick: function(){},
    onClick: function(){},
    onSelect: function(){}
};
