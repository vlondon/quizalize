var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQQuizIcon = require('./CQQuizIcon');

var QuizActions = require('createQuizApp/actions/QuizActions');
var QuizStore  = require('createQuizApp/stores/QuizStore');

var moment = require('moment');

var router = require('createQuizApp/config/router');

require('./CQPublicStyles');

var CQPublic = React.createClass({

    getInitialState: function() {
        return {
            quizzes: []
        };
    },

    componentDidMount: function() {

        QuizActions.loadPublicQuizzes();
        // QuizActions.loadQuizzes();

        QuizStore.addChangeListener(this.onChange);

    },

    componentWillUnmount: function() {

        QuizStore.removeChangeListener(this.onChange);
    },

    getState: function(){

        var quizzes = QuizStore.getPublicQuizzes();

        var newState = { quizzes };

        return newState;

    },

    onChange: function(){
        this.setState(this.getState());
    },

    handlePreview: function(quiz){
        sessionStorage.setItem('mode', 'teacher');
        window.location.href = `/app#/play/public/${quiz.uuid}`;

    },

    handleSet: function(quiz){
        router.setRoute(`/quiz/published/${quiz.uuid}`);
    },

    render: function() {
        var categoryName = function(quiz){
            if (quiz.category && quiz.category.name){
                return (<span className="cq-public__quizcategory">{quiz.category.name}</span>);
            }
            return undefined;
        };
        return (
            <CQPageTemplate className="container cq-public">
                <h2>
                    Choose a quiz for your class
                </h2>
                <p>
                    Check out our pre-made quizzes. We're adding new ones all
                    the time! If you have any suggestions, tell us! Otherwise, you can <CQLink href='/quiz/create'>create your own in 60 seconds</CQLink>.
                </p>
                <ul className="cq-public__list">
                    {this.state.quizzes.map((quiz, key) => {
                        return (
                            <li className="cq-public__quiz" key={key}>
                                <CQQuizIcon className="cq-public__quizicon" name={quiz.name} image={quiz.settings.imageUrl}/>


                                <div className="cq-public__quizname">
                                    {quiz.name}
                                </div>


                                <div className="cq-public__quizextra">
                                    {categoryName(quiz)}
                                    <span className="cq-public__quizcategory">7-11</span>
                                </div>

                            </li>
                        );
                    })}
                </ul>
            </CQPageTemplate>
        );
    }

});

module.exports = CQPublic;


// {category.quizzes.map((quiz, index)=>{
//     return (
//         <div className="row quiz-info-row" key={index}>
//             <div className="col-xs-8">
//                 <a href="" className="quiz-item">
//                     <div className="quiz-title">{quiz.name}</div>
//                 </a>
//             </div>
//             <div className="col-xs-2">
//
//                 <div className="row quiz-info-row">
//
//                     <button className="btn btn-info btn-block" onClick={this.handleSet.bind(this, quiz)}>
//                         Set this quiz
//                     </button>
//                 </div>
//             </div>
//             <div className="col-xs-2">
//
//                 <div className="row quiz-info-row">
//                     <button onClick={this.handlePreview.bind(this, quiz)} className="btn btn-info btn-block">Preview</button>
//                 </div>
//             </div>
//
//         </div>
//
//     );
// })}
