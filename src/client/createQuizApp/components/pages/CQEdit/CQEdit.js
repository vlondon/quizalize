/* @flow */
import React, { PropTypes } from "react";
import {
    CQPageTemplate,
    CQViewWizard,
} from "./../../../components";
import {
    QuizStore,
    MeStore
} from "./../../../stores";
import { router } from "./../../../config";
import type { QuizComplete } from "./../../../../../types";
import CQEditView from "./CQEditView";

type Props = {
    routeParams: Object;
};

type State = {
    quiz: ?QuizComplete;
};

class CQEdit extends React.Component {

    props: Props;
    state: State;

    constructor(props: Props){

        super(props);

        this.state = {
            quiz: this.getQuiz()
        };

        this.onChange = this.onChange.bind(this);
        this.getQuiz = this.getQuiz.bind(this);
    }

    componentDidMount() {
        QuizStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        QuizStore.removeChangeListener(this.onChange);
    }

    onChange(){
        let quiz = this.getQuiz();
        if (quiz && quiz._error === true) {
            // TODO Francesco check this copy, trying to prevent users editing quizzes that they don't own
            // (and now won't load)
            window.swal({
                title: `You're trying to load a Quiz that you don't own`,
                text: `Please ask the author to share it with you or get it from the marketplace`,
                type: "warning",
            }, function(){
                router.setRoute("/quiz/user", true);
            });

        } else {
            this.setState({quiz});
        }
    }

    getQuiz() : ?QuizComplete {
        var quizId = this.state && this.state.quiz ? this.state.quiz.uuid : this.props.routeParams.quizId;
        var quiz;
        if (QuizStore.isLoaded()){
            let user = MeStore.state;
            let {accountType} = user.attributes;
            let privateQuizzes = QuizStore.getPrivateQuizzes();
            if (accountType === 0 && privateQuizzes.length >= 5) {
                window.swal({
                    title: `You've reached your limit`,
                    text: `You have reached your limit of private quizzes`,
                    type: `warning`,
                    showCancelButton: true,
                }, (isConfirm)=>{
                    if (isConfirm) {
                        router.setRoute("/quiz/premium", true);
                    } else {
                        router.goBack();
                    }
                });
            } else {
                quiz = QuizStore.getQuiz(quizId);
            }
        }

        return quiz;
    }

    render () {
        let {quiz} = this.state;
        let editView = quiz ? (<CQEditView {...this.props} />) : undefined;
        return (
            <CQPageTemplate className="cq-edit">
                <CQViewWizard fields={["Which questions?", "Which class?", "That's it!"]}/>
                <div className="cq-container cq-edit">
                    {editView}
                </div>
            </CQPageTemplate>
        );
    }

}

export default CQEdit;


CQEdit.propTypes = {
    routeParams: PropTypes.object
};
