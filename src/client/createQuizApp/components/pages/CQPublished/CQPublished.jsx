/* @flow */
import React from 'react';
import router from './../../../config/router';

import CQViewClassList from './../../../components/views/CQViewClassList';
import CQViewQuizMarketplaceOptions from './../../../components/views/CQViewQuizMarketplaceOptions';

import CQLink from './../../../components/utils/CQLink';

import CQPageTemplate from './../../../components/CQPageTemplate';
import GroupActions from './../../../actions/GroupActions';
import GroupStore  from './../../../stores/GroupStore';
import QuizStore from './../../../stores/QuizStore';
import type { QuizComplete } from './../../../stores/QuizStore';
import CQViewShareQuiz from './../../../components/views/CQViewShareQuiz';


type Props = {
    quizId: string;
    assign?: boolean;
    publish?: boolean;
}

type State = {
    groups: Array<Object>;
    selectedClass: string;
    isMoreVisible: boolean;
    settings: Object;
    newClass: string;
}

export default class CQPublished extends React.Component {

    constructor(props : Props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.getState = this.getState.bind(this);
        this.getQuiz = this.getQuiz.bind(this);


        this.state = this.getState();

    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
        GroupStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
        GroupStore.removeChangeListener(this.onChange);
    }

    getState() : State {

        var groups = GroupStore.getGroups();
        var selectedClass = (groups && groups.length > 0) ? groups[0].code : 'new';
        var isMoreVisible = this.state ? this.state.isMoreVisible : false;
        var quiz = this.getQuiz();
        var settings = quiz ? quiz.meta : {};
        var newClass = '';
        var newState = {
            groups,
            selectedClass,
            isMoreVisible,
            settings,
            newClass
        };

        return newState;

    }

    getQuiz (props? : Props) : ?QuizComplete {

        props = props || this.props;

        var quiz = props.quizId ? QuizStore.getQuiz(props.quizId) : undefined;

        return quiz;
    }

    onChange (){
        this.setState(this.getState());
    }

    handleClick () {

        var redirect = function(quizId, classId){
            router.setRoute(`/quiz/published/${quizId}/${classId}/info`);
        };

        if (this.state.selectedClass === 'new') {
            GroupActions.publishNewAssignment(this.props.quizId, this.state.newClass, this.state.settings)
                .then((response) =>{
                    redirect(this.props.quizId, response.code);
                });

        } else {
            GroupActions.publishAssignment(this.props.quizId, this.state.selectedClass, this.state.settings)
                .then(()=>{
                    redirect(this.props.quizId, this.state.selectedClass);
                });
        }
    }


    render() : any {

        var classList;
        var publishQuiz;
        var shareQuiz;

        classList = (
            <CQViewClassList
                quizId={this.props.quizId}/>
        );

        shareQuiz = <CQViewShareQuiz quizId={this.props.quizId}/>;

        if (!this.state.settings.published && !this.state.settings.originalQuizId) {
            publishQuiz = (<CQViewQuizMarketplaceOptions quizId={this.props.quizId}/>);
        }

        if (this.props.assign === true) {
            publishQuiz = undefined;
            shareQuiz = undefined;
        }

        if (this.props.published === true){
            classList = undefined;
            shareQuiz = undefined;
        }

        if (this.props.share) {
            publishQuiz = undefined;
            classList = undefined;
        }
        return (
            <CQPageTemplate className="cq-published">

                <div className="cq-published__header">

                    <h1>
                        All done…
                    </h1>
                    <h3>
                        Your quiz is ready
                    </h3>
                    <p>
                        Too soon? <CQLink href={`/quiz/create/${this.props.quizId}`} >Continue building</CQLink>
                    </p>
                </div>


                {classList}
                {publishQuiz}
                {shareQuiz}


            </CQPageTemplate>
        );
    }

}

CQPublished.propTypes = {
    quizId: React.PropTypes.string.isRequired,
    assign: React.PropTypes.bool,
    publish: React.PropTypes.bool,
    share: React.PropTypes.bool
};
                // <div className="pricing">
                //     Set pricing and marketplace options
                // </div>
                // <div className="share">
                //     Share with colleagues (they use it free...)
                // </div>
                // <div className="preview">
                //     Preview
                // </div>
                // <div className="back">
                //     Go back and make changes
                // </div>
                // <div className="btn btn-default">
                //     Close and go to my page
                // </div>