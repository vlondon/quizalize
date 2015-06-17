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
            quizzes: [],
            className: '',
            showAuthor: true,
            sortOptions: false,
            profileMode: false,
            onQuizClick: function(){},
            onClick: function(){},
            onSelect: function(){}
        };
    },

    getInitialState: function() {
        var initialState = {
            selectedQuizzes: [],
            quizzes: this.sort(undefined, this.getQuizzesState())
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

        this.setState({quizzes: this.sort(undefined, quizzes)});
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

    sort: function(obj, quizzes){

        if (this.props.sortBy && obj === undefined){
            obj = {
                sort: this.props.sortBy
            };
        }
        console.log('sorting', obj);

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


            console.log('quizzes', quizzes);


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

        console.log('new Quizzes', quizzes);
        return quizzes;
    },

    handleSearch: function(obj, quizzes){

        quizzes = this.sort(obj, quizzes);
        this.setState({quizzes, savedSearch: obj});
    },

    handleEdit: function(quiz, ev){
        ev.stopPropagation();
        this.props.onEdit(quiz);
    },

    handleAssign: function(quiz, ev){
        ev.stopPropagation();
        this.props.onAssign(quiz);
    },

    handleDelete: function(quiz, ev){
        ev.stopPropagation();
        this.props.onDelete(quiz);
    },

    render: function() {
        console.trace("render");
        var author;
        var select;
        var sort;
        var profile = function(){};

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


        if (this.props.profileMode){
            profile = (quiz) => {
                return (<div className="cq-quizzes__buttonbar" >
                    <button className="cq-quizzes__button--edit" onClick={this.handleEdit.bind(this, quiz)}>
                        <span className="fa fa-pencil"></span> Edit
                    </button>

                    <button className="cq-quizzes__button--assign" onClick={this.handleAssign.bind(this, quiz)}>
                        <span className="fa fa-users"></span> Assign quiz to a Class
                    </button>

                    <button className="cq-quizzes__button--delete" onClick={this.handleDelete.bind(this, quiz)}>
                        <span className="fa fa-trash-o"></span>
                    </button>
                </div>);
            };

        }

        return (
            <div>
                {sort}
                <ul className={`cq-viewquizlist ${this.props.className}`}>
                    {this.state.quizzes.map((quiz, key) => {
                        return (
                            <li className="cq-viewquizlist__quiz" key={quiz.uuid} onClick={this.handleClick.bind(this, quiz)}>

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
                                    {profile(quiz)}
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
