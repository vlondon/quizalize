var React = require('react');

var CQPageTemplate = require('createQuizApp/components/CQPageTemplate');
var CQLink = require('createQuizApp/components/utils/CQLink');
var CQPublicList = require('./CQPublicList');
var CQPublicSort = require('./CQPublicSort');
var CQAppGrid = require('./CQAppGrid');

var CQViewQuizList = require('createQuizApp/components/views/CQViewQuizList');

var QuizStore  = require('createQuizApp/stores/QuizStore');



var router = require('createQuizApp/config/router');

require('./CQPublicStyles');

var CQPublic = React.createClass({

    getInitialState: function() {
        return this.getState();
    },

    componentDidMount: function() {

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

    handleBuy: function(quiz){
        console.log('buy quiz?', quiz);
        swal({
                title: 'Confirm Purchase',
                text: `Are you sure you want purchase <br/><b>${quiz.meta.name}</b> <br/> for <b>free</b>`,
                showCancelButton: true,
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
                html: true
            }, (isConfirm) => {
            if (isConfirm){
                setTimeout(()=>{

                    var newTransaction = {
                        meta: {
                            type: 'quiz',
                            quizId: quiz.uuid,
                            price: 0
                        }
                    };

                    swal({
                        title: 'Working…',
                        text: `We're processing your order`,
                        showConfirmButton: false
                    });


                }, 300);
            }
        });
    },

    render: function() {

        return (
            <CQPageTemplate className="container cq-public">
                <h2>
                    Choose a quiz for your class
                </h2>
                <p>
                    Check out our pre-made quizzes. We're adding new ones all
                    the time! If you have any suggestions, tell us! Otherwise, you can <CQLink href='/quiz/create'>create your own in 60 seconds</CQLink>.
                </p>

                <CQAppGrid/>
                <CQPublicSort className="cq-public__sort"/>
                <CQViewQuizList quizzes={this.state.quizzes} className="cq-public__list">
                    <span className='cq-public__button' onClick={this.handleBuy}>
                        Free
                    </span>
                </CQViewQuizList>
{/* =======
//
//                 {this.state.quizzes.map((category, categoryIndex) => {
//                     return (<div className="row" key={categoryIndex}>
//                         <div className="col-md-12">
//                             <div className="quiz-topic-block">
//                                 <a href="" className="quiz-link">
//                                     <h2 className="quiz-topic-title text-center">
//                                         {category.category.name}
//                                     </h2>
//                                 </a>
//                                 <div className="quiz-list collapse in">
//                                     {category.quizzes.map((quiz, index)=>{
//                                         return (
//                                             <div className="row quiz-info-row" key={index}>
//                                                 <div className="col-xs-8">
//                                                     <a href="" className="quiz-item">
//                                                         <div className="quiz-title">{quiz.meta.name}</div>
//                                                     </a>
//                                                 </div>
//                                                 <div className="col-xs-2">
//
//                                                     <div className="row quiz-info-row">
//
//                                                         <button className="btn btn-info btn-block" onClick={this.handleSet.bind(this, quiz)}>
//                                                             Set this quiz
//                                                         </button>
//                                                     </div>
//                                                 </div>
//                                                 <div className="col-xs-2">
//
//                                                     <div className="row quiz-info-row">
//                                                         <button onClick={this.handlePreview.bind(this, quiz)} className="btn btn-info btn-block">Preview</button>
//                                                     </div>
//                                                 </div>
//
//                                             </div>
//
//                                         );
//                                     })}
//
//                                 </div>
//                             </div>
//                         </div>
//                     </div>);
//                 })}
// >>>>>>> develop */}
            </CQPageTemplate>
        );
    }

});

module.exports = CQPublic;
